from pathlib import Path

from playwright.sync_api import Page, TimeoutError

RECEIPTS_URL = "https://www.trumf.no/profil/kvitteringer"
SESSION_FILE = Path(__file__).resolve().parent / "trumf_session.json"


def log(message: str) -> None:
    print(message)


def login_to_site(page: Page) -> None:
    page.goto("https://www.trumf.no", wait_until="domcontentloaded")
    log("Login manually in the browser, including SMS code if required.")
    input(f"Press Enter ONLY when you see the receipts page ({RECEIPTS_URL})... ")

    try:
        page.wait_for_url("**/profil/kvitteringer**", timeout=15000)
    except TimeoutError:
        if "/profil/kvitteringer" not in page.url:
            page.goto(RECEIPTS_URL, wait_until="domcontentloaded")

    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1000)
    log(f"Receipts page opened: {page.url}")


def ensure_logged_in(page: Page, context) -> None:
    page.goto(RECEIPTS_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(1000)

    if "/profil/kvitteringer" in page.url and "id.trumf.no" not in page.url:
        log("Session loaded from disk.")
        return

    log("No valid saved session. Manual login required.")
    login_to_site(page)
    context.storage_state(path=str(SESSION_FILE))
    log(f"Saved new session to {SESSION_FILE}")


def ensure_receipts_page(page: Page, context) -> None:
    if "id.trumf.no" in page.url or "/ui/login" in page.url:
        ensure_logged_in(page, context)
        return

    if "/profil/kvitteringer" not in page.url:
        page.goto(RECEIPTS_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(600)
        if "id.trumf.no" in page.url:
            ensure_logged_in(page, context)
