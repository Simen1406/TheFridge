from playwright.sync_api import sync_playwright

from scripts.trumf.auth import RECEIPTS_URL, SESSION_FILE, ensure_logged_in, log, login_to_site
from scripts.trumf.download import DOWNLOAD_DIR, download_receipts_month_by_month


def run_download_flow() -> None:
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
            log("No saved session file found. Manual login required.")
            login_to_site(page)
            context.storage_state(path=str(SESSION_FILE))
            log(f"Saved new session to {SESSION_FILE}")

        downloaded, total_candidates = download_receipts_month_by_month(
            page,
            context,
            latest_date_to_retrieve="17.02.2026",
        )

        log(f"Downloaded {downloaded}/{total_candidates} receipts to {DOWNLOAD_DIR}")

        page.close()
        context.close()
        browser.close()


if __name__ == "__main__":
    run_download_flow()
