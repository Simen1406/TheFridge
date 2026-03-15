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
