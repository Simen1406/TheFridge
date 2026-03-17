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
