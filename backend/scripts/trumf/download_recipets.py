from pathlib import Path
from playwright.sync_api import Page, TimeoutError, sync_playwright

RECEIPTS_URL = "https://www.trumf.no/profil/kvitteringer"
DOWNLOAD_DIR = Path(__file__).resolve().parent / "downloads"


def enter_site_login_and_go_to_receipts(page: Page) -> None:
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


def find_downloads(page: Page):
    # Expand all receipt submenus/accordions before collecting download actions.
    expand_selectors = [
        "button[aria-expanded='false']",
        "[role='button'][aria-expanded='false']",
        "details:not([open]) > summary",
    ]

    for selector in expand_selectors:
        locator = page.locator(selector)
        count = locator.count()
        for i in range(count):
            item = locator.nth(i)
            try:
                if item.is_visible():
                    item.click(timeout=1000)
                    page.wait_for_timeout(100)
            except Exception:
                # Ignore non-clickable controls and continue.
                continue

    # Each receipt row has a menu trigger icon (#receipt-stroke) that must be
    # clicked before download actions become visible.
    receipt_menu_triggers = page.locator(
        ",".join(
            [
                "button:has(svg use[href='#receipt-stroke'])",
                "button:has(svg use[xlink\\:href='#receipt-stroke'])",
                "a:has(svg use[href='#receipt-stroke'])",
                "[role='button']:has(svg use[href='#receipt-stroke'])",
            ]
        )
    )

    print(f"Found {receipt_menu_triggers.count()} receipt menu trigger(s).")
    return receipt_menu_triggers


def download_receipts(page: Page, receipt_menu_triggers) -> int:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    downloaded = 0

    total = receipt_menu_triggers.count()
    for i in range(total):
        trigger = receipt_menu_triggers.nth(i)
        try:
            if not trigger.is_visible():
                continue

            trigger.scroll_into_view_if_needed()
            trigger.click(timeout=3000)
            page.wait_for_timeout(200)

            action = page.locator(
                ",".join(
                    [
                        "a[download]",
                        "a[href*='.pdf']",
                        "a[href*='jpeg']",
                        "a[href*='jpg']",
                        "a[href*='png']",
                        "a:has-text('Last ned')",
                        "button:has-text('Last ned')",
                        "button:has-text('Download')",
                        "[role='menuitem']:has-text('Last ned')",
                    ]
                )
            ).first

            if action.count() == 0 or not action.is_visible():
                page.keyboard.press("Escape")
                print(f"Skipped receipt #{i + 1}: no visible download action.")
                continue

            with page.expect_download(timeout=5000) as download_info:
                action.click()

            download = download_info.value
            filename = download.suggested_filename or f"receipt_{i + 1}.pdf"
            target = DOWNLOAD_DIR / filename
            if target.exists():
                stem = target.stem
                suffix = target.suffix
                n = 1
                while (DOWNLOAD_DIR / f"{stem}_{n}{suffix}").exists():
                    n += 1
                target = DOWNLOAD_DIR / f"{stem}_{n}{suffix}"

            download.save_as(str(target))
            downloaded += 1
            print(f"Downloaded: {target.name}")
            page.keyboard.press("Escape")
        except TimeoutError:
            print(f"Skipped receipt #{i + 1}: no browser download event.")
            page.keyboard.press("Escape")
        except Exception as exc:
            print(f"Failed receipt #{i + 1}: {exc}")
            page.keyboard.press("Escape")

    return downloaded


def run_download_flow() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        enter_site_login_and_go_to_receipts(page)
        download_locator = find_downloads(page)
        downloaded = download_receipts(page, download_locator)

        print(f"Done. Downloaded {downloaded} receipt(s) to: {DOWNLOAD_DIR}")
        browser.close()


if __name__ == "__main__":
    run_download_flow()
