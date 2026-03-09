import re
from playwright.sync_api import Page, expect, sync_playwright
import time

def test_site():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        #open login page
        page.goto("https://www.trumf.no")
        print("login manually in the brwoswer")
        input("Press Enter after logging in...")

        print("login confirmed, navigating to receipts page")
        page.goto("https://www.trumf.no/profil/kvitteringer")

        page.wait_for_timeout(5000)  # Wait for the page to load
        print("page loaded, looking for receipts")

        browser.close()


if __name__ == "__main__":
    test_site()

