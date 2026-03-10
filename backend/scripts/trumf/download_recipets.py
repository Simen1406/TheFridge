from datetime import datetime
from pathlib import Path
from playwright.sync_api import Locator, Page, TimeoutError, sync_playwright

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


def expand_rows(page: Page):
    page.wait_for_selector("tr.ws-transaction-history-table__row", timeout=15000)
    expand_buttons = page.locator("button.ws-transaction-history-table__toggle-button")
    count = expand_buttons.count()

    expanded = 0
    for i in range(count):
        button = expand_buttons.nth(i)
        if button.is_visible():
            button.click()
            expanded += 1
            page.wait_for_timeout(300)

    print(f"Expanded {expanded} rows.")
        
            
def find_receipt_rows(page: Page):
    page.wait_for_selector("tr.ws-transaction-history-table__row", timeout=15000)
    rows = page.locator(
        "tr.ws-transaction-history-table__row:has(span.ws-transaction-history-table__description-date)"
    )
    rows = list(rows.all())
    count = len(rows)
    print(f"Found {count} dated rows in the transaction history table.")
    return rows

def find_receipt_dates(rows: list[Locator], latest_date_to_retrieve: str):
    cutoff_date = datetime.strptime(latest_date_to_retrieve, "%d.%m.%Y")
    rows_to_process = []

    for i, row in enumerate(rows):
        date_locator = row.locator("span.ws-transaction-history-table__description-date")
        if date_locator.count() == 0:
            print(f"[{i}] Skip row without date.")
            continue

        date_text = date_locator.first.inner_text(timeout=2000).strip()
        row_date = datetime.strptime(date_text, "%d.%m.%Y")

        if row_date >= cutoff_date:
            rows_to_process.append(row)
            print(f"[{i}] Keep row with date {date_text}")
        else:
            print(f"[{i}] Stop at date {date_text} (< {latest_date_to_retrieve})")
            break

    print(f"Rows to process: {len(rows_to_process)}")
    return rows_to_process

def download_receipt(page: Page):
    pass



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

        expand_rows(page)
        rows = find_receipt_rows(page)
        rows_to_process = find_receipt_dates(rows, latest_date_to_retrieve="17.02.2026")
        print(f"Ready to download {len(rows_to_process)} receipts.")

        page.close()
        context.close()
        browser.close()


if __name__ == "__main__":
    run_download_flow()
