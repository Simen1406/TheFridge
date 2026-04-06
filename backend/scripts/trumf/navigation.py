from datetime import datetime

from playwright.sync_api import Locator, Page, TimeoutError

from scripts.trumf.auth import RECEIPTS_URL, ensure_receipts_page

MONTH_ROW_SELECTOR = "tr:has(th.ws-transaction-history-table__col--description.ws-transaction-history-table__col:has-text('Sum for'))"
RECEIPT_ROW_SELECTOR = "tr:has(span.ws-transaction-history-table__description-date)"


def get_month_rows(page: Page):
    for _ in range(3):
        rows = page.locator(MONTH_ROW_SELECTOR)
        if rows.count() > 0:
            return rows

        page.wait_for_timeout(1000)
        if "/profil/kvitteringer" not in page.url:
            page.goto(RECEIPTS_URL, wait_until="domcontentloaded")

    raise TimeoutError(f"Could not find month rows. Current URL: {page.url}")


def expand_row(page: Page, row: Locator) -> None:
    toggle = row.locator("button.ws-transaction-history-table__toggle-button").first
    if toggle.count() == 0:
        return

    row.scroll_into_view_if_needed(timeout=2000)
    is_expanded = (toggle.get_attribute("aria-expanded") or "").lower() == "true"
    if not is_expanded:
        toggle.click()
        page.wait_for_timeout(250)


def ensure_receipt_rows_available(page: Page) -> bool:
    rows = page.locator(RECEIPT_ROW_SELECTOR)
    if rows.count() > 0:
        return True

    month_rows = page.locator(MONTH_ROW_SELECTOR)
    for i in range(month_rows.count()):
        expand_row(page, month_rows.nth(i))

    page.wait_for_timeout(400)
    return page.locator(RECEIPT_ROW_SELECTOR).count() > 0


def get_visible_receipts(page: Page) -> list[tuple[str, str]]:
    rows = page.locator(RECEIPT_ROW_SELECTOR)
    receipts: list[tuple[str, str]] = []

    for i in range(rows.count()):
        row = rows.nth(i)
        if not row.is_visible():
            continue

        date_text = row.locator("span.ws-transaction-history-table__description-date").first.inner_text(timeout=1500).strip()
        merchant_loc = row.locator("span.ws-transaction-history-table__description-title")
        if merchant_loc.count() > 0:
            merchant_text = merchant_loc.first.inner_text(timeout=1500).strip()
        else:
            row_text = row.inner_text(timeout=1500).strip()
            lines = [line.strip() for line in row_text.splitlines() if line.strip()]
            merchant_text = lines[0] if lines else "unknown-store"

        receipts.append((date_text, merchant_text))

    return receipts


def find_target_row(page: Page, date: str, merchant: str, normalize_text):
    rows = page.locator(RECEIPT_ROW_SELECTOR)
    normalized_target = normalize_text(merchant)
    date_rows: list[Locator] = []

    for i in range(rows.count()):
        row = rows.nth(i)
        if not row.is_visible():
            continue

        date_text = row.locator("span.ws-transaction-history-table__description-date").first.inner_text(timeout=1500).strip()
        if date_text == date:
            date_rows.append(row)

    for row in date_rows:
        merchant_loc = row.locator("span.ws-transaction-history-table__description-title")
        if merchant_loc.count() > 0:
            row_merchant = merchant_loc.first.inner_text(timeout=1500).strip()
        else:
            row_text = row.inner_text(timeout=1500).strip()
            lines = [line.strip() for line in row_text.splitlines() if line.strip()]
            row_merchant = lines[0] if lines else "unknown-store"

        norm_row = normalize_text(row_merchant)
        if norm_row == normalized_target or normalized_target in norm_row or norm_row in normalized_target:
            return row

    return date_rows[0] if date_rows else None


def find_details_button(row: Locator):
    selectors = [
        "button.ws-transaction-history-table__details-button",
        "button.ngr-button.ws-transaction-history-table__details-button.ngr-button--cancel",
        "button:has-text('Detalj')",
        "button[aria-label*='detalj' i]",
    ]

    for selector in selectors:
        button = row.locator(selector).first
        if button.count() > 0:
            return button

    return None


def wait_for_detail_view(page: Page, timeout_ms: int = 12000) -> bool:
    end_time = datetime.now().timestamp() + (timeout_ms / 1000)
    selectors = [
        "a:has-text('Tilbake til kvitteringer')",
        "#downloadReceipt",
        "button.ws-transaction-details-purchase-header__download-button",
        "button:has-text('Last ned kvittering')",
    ]

    while datetime.now().timestamp() < end_time:
        for selector in selectors:
            if page.locator(selector).count() > 0:
                return True
            for frame in page.frames:
                try:
                    if frame.locator(selector).count() > 0:
                        return True
                except Exception:
                    continue
        page.wait_for_timeout(300)

    return False


def return_to_receipts_list(page: Page, context) -> None:
    back_link = page.locator("a:has-text('Tilbake til kvitteringer')")
    if back_link.count() > 0:
        try:
            back_link.first.click()
            page.wait_for_selector(MONTH_ROW_SELECTOR, timeout=8000)
            return
        except Exception:
            pass

    try:
        if "/profil/kvitteringer" not in page.url:
            page.go_back(wait_until="domcontentloaded", timeout=6000)
    except Exception:
        pass

    ensure_receipts_page(page, context)
    if page.locator(MONTH_ROW_SELECTOR).count() == 0:
        page.goto(RECEIPTS_URL, wait_until="domcontentloaded")
        ensure_receipts_page(page, context)
