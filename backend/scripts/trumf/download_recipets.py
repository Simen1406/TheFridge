from datetime import datetime
from pathlib import Path
from playwright.sync_api import Locator, Page, TimeoutError, sync_playwright
import re

RECEIPTS_URL = "https://www.trumf.no/profil/kvitteringer"
DOWNLOAD_DIR = Path(__file__).resolve().parent / "downloads"
SESSION_FILE = Path(__file__).resolve().parent / "trumf_session.json"


def login_to_site(page: Page) -> None:
    page.goto("https://www.trumf.no", wait_until="domcontentloaded")
    print("Login manually in the browser, including SMS code if required.")
    input(f"Press Enter ONLY when you see the receipts page ({RECEIPTS_URL})... ")

    # Avoid interrupting auth redirects (SMS/OIDC callback) by waiting for
    # the browser to settle on the receipts URL before forcing navigation.
    try:
        page.wait_for_url("**/profil/kvitteringer**", timeout=15000)
    except TimeoutError:
        page.wait_for_timeout(1500)
        if "/profil/kvitteringer" not in page.url:
            try:
                page.goto(RECEIPTS_URL, wait_until="domcontentloaded")
            except Exception:
                page.wait_for_url("**/profil/kvitteringer**", timeout=30000)

    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1500)
    print(f"Receipts page opened: {page.url}")

def ensure_logged_in(page: Page, context) -> None:
    page.goto(RECEIPTS_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(1000)

    # If session is valid, Trumf keeps us on the receipts page.
    if "/profil/kvitteringer" in page.url:
        print("Session loaded from disk.")
        return

    print("No valid saved session. Manual login required.")
    login_to_site(page)
    context.storage_state(path=str(SESSION_FILE))
    print(f"Saved new session to {SESSION_FILE}")

def find_last_row_to_expand(page: Page, month: str):
    page.wait_for_selector(
        "th.ws-transaction-history-table__col--description.ws-transaction-history-table__col",
        timeout=15000,
    )
    month_cells = page.locator(
        "th.ws-transaction-history-table__col--description.ws-transaction-history-table__col",
        has_text=month,
    )
    count = month_cells.count()
    if count == 0:
        raise ValueError(f"Could not find any month row with text '{month}'")

    month_cell = month_cells.first
    month_text = month_cell.inner_text(timeout=2000).strip()
    month_row = month_cell.locator("xpath=..")  # parent <tr>
    print(f"Found month row to expand: '{month_text}'")
    return month_row, month_text

def expand_row(page:Page, row: Locator) -> bool:
    toggle_button = row.locator("button.ws-transaction-history-table__toggle-button")
    if toggle_button.count() > 0:
        toggle = toggle_button.first
        row.scroll_into_view_if_needed(timeout=2000)
        aria_expanded = (toggle.get_attribute("aria-expanded") or "").lower()
        if aria_expanded != "true":
            toggle.click()
            page.wait_for_timeout(250)
            return True
    print(f"No toggle button found in row with text '{row.inner_text(timeout=2000).strip()}', or it is already expanded.")
    return False

def expand_rows_until_cutoff(page: Page, latest_date_to_retrieve: str) -> list[tuple[str, str]]:
    last_row_to_expand, _ = find_last_row_to_expand(page, month="februar")
    expand_row(page, last_row_to_expand)

    page.wait_for_selector("tr.ws-transaction-history-table__row", timeout=15000)
    rows_to_process: list[tuple[str, str]] = []

    cutoff_date = datetime.strptime(latest_date_to_retrieve, "%d.%m.%Y")
    rows = page.locator(
        "tr.ws-transaction-history-table__row:has(span.ws-transaction-history-table__description-date)"
    )
    count = rows.count()
    for i in range(count):
        row = rows.nth(i)
        date_text = row.locator("span.ws-transaction-history-table__description-date").first.inner_text(timeout=2000).strip()
        try:
            transaction_date = datetime.strptime(date_text, "%d.%m.%Y")
            if transaction_date >= cutoff_date:
                merchant_loc = row.locator("span.ws-transaction-history-table__description-title")
                merchant_text = merchant_loc.first.inner_text(timeout=2000).strip() if merchant_loc.count() > 0 else "unknown-store"
                rows_to_process.append((date_text, merchant_text))
            else:
                print(f"Skipping row with date {date_text} it is too long ago.")
        except ValueError:
            print(f"Could not parse date '{date_text}' in row {i}, skipping.")

    print(f"Total rows found: {count}")
    print(f"Rows to process: {len(rows_to_process)}")
    return rows_to_process


def _safe_filename(value: str) -> str:
    cleaned = re.sub(r"[\\/:*?\"<>|]+", "_", value)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned or "receipt"


def download_receipt(page: Page, target_date: str, target_merchant: str, index: int) -> bool:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

    if "/profil/kvitteringer" not in page.url:
        page.goto(RECEIPTS_URL, wait_until="domcontentloaded")

    page.wait_for_selector("tr.ws-transaction-history-table__row", timeout=15000)
    rows = page.locator(
        "tr.ws-transaction-history-table__row:has(span.ws-transaction-history-table__description-date)"
    )

    target_row = None
    for i in range(rows.count()):
        row = rows.nth(i)
        date_text = row.locator("span.ws-transaction-history-table__description-date").first.inner_text(timeout=2000).strip()
        if date_text != target_date:
            continue

        merchant_loc = row.locator("span.ws-transaction-history-table__description-title")
        merchant_text = merchant_loc.first.inner_text(timeout=2000).strip() if merchant_loc.count() > 0 else "unknown-store"
        if merchant_text == target_merchant:
            target_row = row
            break

    if target_row is None:
        print(f"[{index}] Could not find list row for {target_date} - {target_merchant}.")
        return False

    target_row.scroll_into_view_if_needed(timeout=2000)
    expand_row(page, target_row)

    details_button = target_row.locator(
        "button.ngr-button.ws-transaction-history-table__details-button.ngr-button--cancel"
    ).first
    if details_button.count() == 0:
        details_button = target_row.locator("button.ws-transaction-history-table__details-button").first
    if details_button.count() == 0:
        print(f"[{index}] No details button found for {target_date} - {target_merchant}.")
        return False

    details_button.click()
    page.wait_for_selector("button[aria-label='downloadReceipt']", timeout=15000)

    receipt_download_button = page.locator("button[aria-label='downloadReceipt']").first
    base_name = _safe_filename(f"{target_date}_{target_merchant}_{index + 1}")

    with page.expect_download(timeout=20000) as download_info:
        receipt_download_button.click()

    download = download_info.value
    extension = Path(download.suggested_filename).suffix or ".pdf"
    target_path = DOWNLOAD_DIR / f"{base_name}{extension}"
    download.save_as(str(target_path))
    print(f"[{index}] Downloaded: {target_path.name}")

    page.go_back(wait_until="domcontentloaded")
    page.wait_for_selector("tr.ws-transaction-history-table__row", timeout=15000)
    return True



def run_download_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context_args = {"accept_downloads": True}
        if SESSION_FILE.exists():
            context_args["storage_state"] = str(SESSION_FILE)

        context = browser.new_context(**context_args)
        page = context.new_page()
        page.goto(RECEIPTS_URL, wait_until="domcontentloaded")

        if SESSION_FILE.exists():
            ensure_logged_in(page, context)
        else:
            print("No saved session file found. Manual login required.")
            login_to_site(page)
            context.storage_state(path=str(SESSION_FILE))
            print(f"Saved new session to {SESSION_FILE}")

        rows_to_process = expand_rows_until_cutoff(page, latest_date_to_retrieve="17.02.2026")
        print(f"Ready to download {len(rows_to_process)} receipts.")

        downloaded = 0
        for i, (date_text, merchant_text) in enumerate(rows_to_process):
            try:
                if download_receipt(page, date_text, merchant_text, i):
                    downloaded += 1
            except TimeoutError:
                print(f"[{i}] Download timed out for row.")
            except Exception as exc:
                print(f"[{i}] Download failed: {exc}")

        print(f"Downloaded {downloaded}/{len(rows_to_process)} receipts to {DOWNLOAD_DIR}")

        page.close()
        context.close()
        browser.close()


if __name__ == "__main__":
    run_download_flow()
