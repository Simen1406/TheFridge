from pathlib import Path
import re
from datetime import datetime

from playwright.sync_api import Locator, Page, TimeoutError

from scripts.trumf.auth import ensure_receipts_page, log
from scripts.trumf.navigation import (
    MONTH_ROW_SELECTOR,
    ensure_receipt_rows_available,
    expand_row,
    find_details_button,
    find_target_row,
    get_month_rows,
    get_visible_receipts,
    return_to_receipts_list,
    wait_for_detail_view,
)

DOWNLOAD_DIR = Path(__file__).resolve().parent / "downloads"


def safe_filename(value: str) -> str:
    cleaned = re.sub(r"[\\/:*?\"<>|]+", "_", value)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned or "receipt"


def normalize_text(value: str) -> str:
    return " ".join(value.split()).strip().casefold()


def find_download_button_in_scope(scope):
    selectors = [
        "#downloadReceipt",
        "button[id='downloadReceipt']",
        "button[id*='download' i]",
        "button[aria-label='downloadReceipt']",
        "button[aria-label*='download' i]",
        "button.ws-transaction-details-purchase-header__download-button",
        "button:has(use[href*='download-arrow'])",
        "button:has-text('Last ned kvittering')",
        "button:has-text('Last ned')",
    ]

    for selector in selectors:
        matches = scope.locator(selector)
        for i in range(matches.count()):
            button = matches.nth(i)
            try:
                if button.is_visible(timeout=500):
                    return button
            except Exception:
                continue

    return None


def find_download_button(page: Page):
    for _ in range(20):
        button = find_download_button_in_scope(page)
        if button is not None:
            return button

        for frame in page.frames:
            try:
                button = find_download_button_in_scope(frame)
                if button is not None:
                    return button
            except Exception:
                continue

        page.wait_for_timeout(500)

    return None


def try_download_with_button(page: Page, button: Locator, base_name: str) -> bool:
    for attempt in range(3):
        try:
            timeout_ms = 45000 if attempt == 0 else 30000
            with page.expect_download(timeout=timeout_ms) as download_info:
                if attempt == 0:
                    button.click()
                else:
                    button.click(force=True)

            download = download_info.value
            extension = Path(download.suggested_filename).suffix or ".pdf"
            target_path = DOWNLOAD_DIR / f"{base_name}{extension}"
            download.save_as(str(target_path))
            suffix = "" if attempt == 0 else f" (retry {attempt})"
            log(f"Downloaded via browser event{suffix}: {target_path.name}")
            return True
        except TimeoutError:
            continue

    popup = None
    try:
        with page.expect_popup(timeout=15000) as popup_info:
            button.click(force=True)
        popup = popup_info.value
        try:
            popup.wait_for_load_state("domcontentloaded", timeout=10000)
        except TimeoutError:
            pass
    except TimeoutError:
        button.click(force=True)
        page.wait_for_timeout(1500)

    file_url = popup.url if popup is not None else page.url
    if not file_url:
        if popup is not None:
            popup.close()
        return False

    try:
        response = page.context.request.get(file_url, timeout=30000)
    except TimeoutError:
        if popup is not None:
            popup.close()
        return False

    if not response.ok:
        if popup is not None:
            popup.close()
        return False

    target_path = DOWNLOAD_DIR / f"{base_name}.pdf"
    content_type = (response.headers.get("content-type") or "").lower()
    if "jpeg" in content_type or "jpg" in content_type:
        target_path = DOWNLOAD_DIR / f"{base_name}.jpg"
    elif "png" in content_type:
        target_path = DOWNLOAD_DIR / f"{base_name}.png"

    target_path.write_bytes(response.body())
    log(f"Downloaded via URL fetch: {target_path.name}")

    if popup is not None:
        popup.close()

    return True


def download_receipt(page: Page, context, target_date: str, target_merchant: str, index: int) -> bool:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

    try:
        ensure_receipts_page(page, context)
        if not ensure_receipt_rows_available(page):
            log(f"[{index}] No visible receipt rows available.")
            return False

        target_row = find_target_row(page, target_date, target_merchant, normalize_text)
        if target_row is None:
            log(f"[{index}] Could not find list row for {target_date} - {target_merchant}.")
            return False

        target_row.scroll_into_view_if_needed(timeout=2000)
        details_button = find_details_button(target_row)
        if details_button is None:
            log(f"[{index}] No details button found for {target_date} - {target_merchant}.")
            return False

        detail_opened = False
        for attempt in range(2):
            try:
                if attempt == 0:
                    details_button.click()
                else:
                    details_button.click(force=True)
            except Exception:
                continue

            if wait_for_detail_view(page, timeout_ms=12000):
                detail_opened = True
                break

        if not detail_opened:
            log(f"[{index}] Detail view did not open for {target_date} - {target_merchant}.")
            return False

        download_button = find_download_button(page)
        if download_button is None:
            log(f"[{index}] No download button found for {target_date} - {target_merchant}.")
            return False

        base_name = safe_filename(f"{target_date}_{target_merchant}_{index + 1}")
        return try_download_with_button(page, download_button, base_name)

    except TimeoutError:
        log(f"[{index}] Download flow timed out for {target_date} - {target_merchant}.")
        return False
    finally:
        return_to_receipts_list(page, context)


def download_receipts_month_by_month(page: Page, context, latest_date_to_retrieve: str) -> tuple[int, int]:
    cutoff_date = datetime.strptime(latest_date_to_retrieve, "%d.%m.%Y")
    downloaded = 0
    total_candidates = 0
    seen_receipts: set[tuple[str, str]] = set()
    download_index = 0
    month_index = 0

    while True:
        ensure_receipts_page(page, context)
        month_rows = get_month_rows(page)
        if month_index >= month_rows.count():
            break

        month_row = month_rows.nth(month_index)
        month_text = month_row.inner_text(timeout=2000).strip()
        log(f"Expanding month row: {month_text}")
        expand_row(page, month_row)

        month_receipts = get_visible_receipts(page)
        current_month_candidates: list[tuple[str, str]] = []
        reached_cutoff = False

        for date_text, merchant_text in month_receipts:
            receipt_key = (date_text, merchant_text)
            if receipt_key in seen_receipts:
                continue

            try:
                tx_date = datetime.strptime(date_text, "%d.%m.%Y")
            except ValueError:
                continue

            if tx_date >= cutoff_date:
                current_month_candidates.append((date_text, merchant_text))
                seen_receipts.add(receipt_key)
            else:
                reached_cutoff = True

        log(
            f"Month '{month_text}': found {len(month_receipts)} receipts, "
            f"{len(current_month_candidates)} are on/after cutoff {latest_date_to_retrieve}"
        )

        total_candidates += len(current_month_candidates)
        for date_text, merchant_text in current_month_candidates:
            ensure_receipts_page(page, context)
            month_rows = get_month_rows(page)
            if month_index < month_rows.count():
                expand_row(page, month_rows.nth(month_index))

            if download_receipt(page, context, date_text, merchant_text, download_index):
                downloaded += 1
            download_index += 1

        if reached_cutoff:
            log("Reached rows older than cutoff date. Stopping at this month.")
            break

        month_index += 1

    return downloaded, total_candidates
