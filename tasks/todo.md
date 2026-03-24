# UI Hero Upgrade - Home Page

## Plan

- [x] Inspect current home page structure and styles.
- [x] Create a reusable inside-the-fridge hero component in `frontend/src/components`.
- [x] Integrate the hero component on `frontend/app/(tabs)/index.tsx` only.
- [x] Verify with available frontend commands (typecheck/lint/build or closest available).
- [x] Document verification and risks in review notes.

## Review

- Implemented a reusable `FridgeHero` component with a stylized inside-the-fridge scene.
- Added soft animated ingredient drift and staggered shelf entrance transitions.
- Applied the hero only on the home tab (`app/(tabs)/index.tsx`), keeping the API status card.
- Verification:
  - `npm.cmd run` (frontend): confirmed available scripts (`start`, `android`, `ios`, `web`).
  - `npx.cmd tsc --noEmit` (frontend): passed with no type errors.
  - `test`, `lint`, and dedicated `build` scripts are not currently configured in `frontend/package.json`.
- Risks / follow-ups:
  - Visual tuning may be needed on very small screens depending on preferred hero height.

# Frontend API Standardization

## Plan

- [x] Inspect current API usage in `frontend/src/services/api.ts` and `frontend/app/(tabs)/index.tsx`.
- [x] Add a shared API request helper with consistent `response.ok` handling and typed error metadata.
- [x] Remove hardcoded Home API URL and use the shared service layer for ping.
- [x] Add remaining isolated frontend follow-up tasks to `PROSJEKTSTATUS.md`.
- [x] Verify with available frontend command(s) and document results.

## Review

- Added `requestJson<T>` helper in `frontend/src/services/api.ts` with centralized `response.ok` checks and JSON-safe parsing.
- Added typed `ApiRequestError` (includes `status` + `details`) and wired all existing API calls through the shared helper.
- Removed hardcoded Home API URL and switched ping-test logic to `pingApi()` from service layer.
- Added the remaining isolated frontend steps (the deferred items) to `PROSJEKTSTATUS.md`.
- Verification:
  - `npm.cmd run` (frontend): confirms available scripts are `start`, `android`, `ios`, `web`.
  - `npx.cmd tsc --noEmit` (frontend): passed with no type errors.
  - `test`, `lint`, and dedicated `build` scripts are still not configured in `frontend/package.json`.

# Reusable HeroHeader Refactor (Dribbble #1 Inspired)

## Plan

- [x] Inspect existing hero component and current tab pages using headers.
- [x] Create a reusable `HeroHeader` component in `frontend/src/components` with variant/content props and current theme colors.
- [x] Replace current home hero and add at least one additional tab usage to validate reusability.
- [x] Verify with available frontend checks (typecheck; run lint/test/build if available).
- [x] Add review notes with verification and risks/follow-ups.

## Review

- Added reusable `HeroHeader` component in `frontend/src/components/heroHeader.tsx`.
- Hero supports reusable content props (`eyebrow`, `title`, `subtitle`, `caption`), optional actions, stats, and preview items.
- Replaced old home-only hero usage with `HeroHeader` in `frontend/app/(tabs)/index.tsx`.
- Replaced custom local hero block in `frontend/app/(tabs)/CommonFridgeItems.tsx` with the same `HeroHeader` component for cross-tab reuse.
- Verification:
  - `npm.cmd run` (frontend): available scripts are `start`, `android`, `ios`, `web`.
  - `npx.cmd tsc --noEmit` (frontend): passed with no type errors.
  - `npm.cmd run lint` (frontend): failed because no `lint` script exists.
  - `npm.cmd run test` (frontend): failed because no `test` script exists.
  - `npm.cmd run build` (frontend): failed because no `build` script exists.
- Risks / follow-ups:
  - CTA buttons are intentionally optional and currently have no handlers wired on pages that only need display.
  - The old `frontend/src/components/fridgeHero.tsx` remains in repo and can be removed in a cleanup pass if no longer needed.

# Shared Nav Fridge Hero Accent

## Plan

- [x] Inspect current shared nav layout and confirm image asset source path.
- [x] Copy `fridge header.png` into frontend assets for Expo compatibility.
- [x] Redesign `SharedNav` with reactive image accent, responsive layout, and subtle motion.
- [x] Verify with TypeScript check and document review notes.

## Review

- Copied the provided image from `C:\Users\Simen\dev\fridge header.png` to `frontend/src/assets/fridge-header.png` for reliable Expo bundling.
- Rebuilt `SharedNav` with a more usable layout: product title/subtitle, rounded nav chips, active-route highlighting, and layered glow accents.
- Added a subtle floating animation for the fridge image and responsive behavior that lowers image prominence on narrower widths.
- Verification:
  - `npx.cmd tsc --noEmit` (frontend): passed with no type errors.
- Risks / follow-ups:
  - Route highlighting currently matches expected Expo tab paths (`/`, `/Fridge`, `/Groceries`, `/CommonFridgeItems`); if custom route aliases are introduced, update active-path checks.

# Shared Nav Full-Bleed Background + Scroll Integration

## Plan

- [x] Convert shared nav image treatment from corner accent to full-width background layer.
- [x] Move web nav rendering from root layout into tab pages so it participates in page scroll.
- [x] Preserve existing page spacing by wrapping tab content below nav where needed.
- [x] Verify frontend typecheck and capture review notes.

## Review

- Reworked `SharedNav` to render `fridge-header.png` as a full-bleed animated background layer (`resizeMode="stretch"`) with tint + glows for readable foreground text.
- Removed nav mounting from `frontend/app/_layout.tsx` and mounted it inside tab pages on web (`index`, `Fridge`, `Groceries`, `CommonFridgeItems`).
- Updated tab pages with content wrappers so the full-width menu sits above normal padded content.
- Verification:
  - `npx.cmd tsc --noEmit` (frontend): passed with no type errors.
- Risks / follow-ups:
  - Stretch mode fills width with this portrait image but can look artistically distorted on very wide monitors; if you want sharper art direction, use a wide banner asset next.

# Trumf Receipt Script Refactor

## Plan

- [x] Inspect current receipt download flow and identify duplicated logic.
- [x] Refactor `backend/scripts/trumf/download_recipets.py` with shared helpers and clearer structure while preserving behavior.
- [x] Keep session/login and download behavior unchanged, only improving maintainability and readability.
- [x] Run available backend verification command(s) and document results.
- [x] Add review notes with changes, verification, and residual risks.

## Review

- Refactored `download_recipets.py` around shared helpers for receipt-row parsing, selector reuse, and target-row lookup.
- Preserved login/session flow and end-to-end download behavior while removing duplicated row scanning/parsing logic.
- Moved hardcoded flow values into named constants (`DEFAULT_MONTH_TO_EXPAND`, `DEFAULT_LATEST_DATE_TO_RETRIEVE`) without changing defaults.
- Verification:
  - `python -m compileall scripts/trumf/download_recipets.py` (backend): passed.
  - `.\\venv\\Scripts\\python.exe -m compileall scripts/trumf/download_recipets.py` (backend): passed.
  - `.\\venv\\Scripts\\python.exe -m pytest` (backend): no tests collected (exit code 1).
  - `.\\venv\\Scripts\\python.exe -m ruff check .` (backend): failed (`No module named ruff`).
  - `.\\venv\\Scripts\\python.exe -m mypy .` (backend): failed (`No module named mypy`).
- Risks / follow-ups:
  - `month_to_expand` default is still `"februar"`; if month labels vary by locale or target window, make it configurable from CLI args/env.
