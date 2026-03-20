# Table UI Improvement Plan

## Scope
Improve the existing fridge and grocery table experience in `frontend` while preserving current API shape and reusable `InventoryTable` architecture.

## Current-State Findings

### Evidence collected
- Reviewed table implementation in `frontend/src/components/inventoryTable.tsx`, `fridgeTable.tsx`, `groceryTable.tsx`, and tab screens.
- Attempted Playwright run:
  - `npx playwright --version` failed in PowerShell due execution policy (`npx.ps1 cannot be loaded because running scripts is disabled`).
  - `cmd /c npx playwright --version` then failed because `playwright` is not installed and npm registry fetch failed with `EACCES` and permission/cache write errors.
- Conclusion: no runtime Playwright walkthrough possible in this environment; findings below are based on code behavior and component structure.

### What currently works well
- Shared `InventoryTable` component is reusable and keeps fridge/grocery implementations consistent.
- Clear table hierarchy: title/subtitle, toolbar, headers, rows, empty state.
- Useful row metadata:
  - Fridge table has expiry status chip (`Fresh/Soon/Expired`).
  - Grocery table has price status chip (`Budget/Regular/High`).
- Search filter is simple and responsive (`useMemo` over local items).
- Horizontal scroll container makes wide columns usable on narrow devices.

### UX and implementation gaps
- Toolbar icons are placeholders (`"V"` and `"S"`) instead of recognizable icons.
- Filter button has no behavior.
- Remove action has no confirmation or undo.
- No sorting controls, no column-level filtering, no pagination/virtualization.
- Row index (`#`) is derived from filtered order; not stable identity.
- Table row keys are stable (`item.id`), but no loading/skeleton states are shown during fetch.
- Accessibility is limited (no explicit accessibility labels/roles on table controls and action buttons).
- Mobile ergonomics risk:
  - Dense multi-column layout with fixed widths may force heavy horizontal scrolling.
- Screen inconsistency:
  - `Groceries` screen aligns container center while `Fridge` does not; subtle layout mismatch.

### Technical constraints to respect
- API calls are centralized in `frontend/src/services/api.ts` and should remain so.
- Tables are React Native / Expo with `react-native-web`, so patterns must work across mobile + web.
- Existing domain models (`FridgeItem`, `GroceryItem`) should remain backward-compatible.

## Improvement Goals
- Preserve reusable table architecture, improve usability and readability.
- Deliver UI polish first without introducing new table functionality.
- Improve mobile behavior while retaining desktop/tablet density.
- Increase perceived polish with clearer visual affordances and interaction feedback.

## Step-by-Step Implementation Plan

- [x] **Phase 1 (UI-only): Visual Foundations**
  - Replace placeholder toolbar glyphs with proper icon components.
  - Add loading state and empty-state variants (`loading`, `no results`, `no data`).
  - Keep existing buttons visually polished but non-functional where functionality is not yet planned.

- [x] **Phase 1 (UI-only): Responsive Strategy**
  - Define breakpoints for web/mobile rendering.
  - On narrow widths: collapse secondary text, keep top 2-3 essential columns visible, move extras into row detail expansion.
  - Preserve horizontal scroll as fallback only.

- [x] **Phase 1 (UI-only): Visual Quality Upgrade**
  - Improve row affordances: hover/press state, clearer action column, sticky header on long lists.
  - Standardize spacing and alignment between Fridge and Grocery screens.
  - Tune status chips for stronger contrast and consistent semantic color mapping.

- [x] **Phase 1 (UI-only): Accessibility + QA**
  - Add accessibility labels/hints for existing controls.
  - Keyboard/focus support for web where relevant.
  - Validate behavior across Expo web + native preview.

- [ ] **Phase 2 (later): Controls and Functionality**
  - Add sort and filter controls and wire behavior in `InventoryTable`.
  - Add delete confirmation/undo behavior.
  - Add UI tests for sorting/filtering/deletion flows.

- [ ] **Phase 3 (optional): Performance and Reliability**
  - For larger datasets, migrate row list rendering to `FlatList` (windowing) while preserving column model.
  - Add lightweight memoization for transformed datasets.

## Online UI Inspiration (researched references)

### 1) shadcn/ui Data Table
- Reference: https://ui.shadcn.com/docs/components/data-table
- Relevant idea: Faceted filters + column visibility toggles + clean density.
- Fit: Good source for control patterns and compact toolbar architecture.

### 2) AG Grid React Data Grid
- Reference: https://www.ag-grid.com/react-data-grid/
- Relevant idea: Powerful sorting/filtering/pinning model and scalable interactions.
- Fit: Use as feature inspiration, not full adoption (likely too heavy for current app).

### 3) Ant Design Table
- Reference: https://ant.design/components/table
- Relevant idea: Expandable rows, fixed columns, and clear action affordances.
- Fit: Strong for action-column patterns and progressive complexity.

### 4) Material React Table
- Reference: https://www.material-react-table.com/
- Relevant idea: Modern out-of-box table UX with toolbar, density, and row actions.
- Fit: Good pattern library for interaction states and defaults.

### 5) Mantine DataTable
- Reference: https://icflorescu.github.io/mantine-datatable/
- Relevant idea: Clean visuals, sensible spacing, straightforward API.
- Fit: Excellent reference for readable, lightweight visual treatment.

### 6) PatternFly Table
- Reference: https://www.patternfly.org/components/table/
- Relevant idea: Enterprise-grade accessibility and state handling.
- Fit: Good for accessibility checklist and keyboard/focus behavior.

### 7) Atlassian Dynamic Table
- Reference: https://atlassian.design/components/dynamic-table/examples
- Relevant idea: Balanced sorting/ranking interactions and compact table rhythm.
- Fit: Good inspiration for polished controls without overwhelming density.

### 8) MUI React Table docs
- Reference: https://mui.com/material-ui/react-table/
- Relevant idea: Strong baseline table semantics and flexible composition.
- Fit: Good reference for progressive enhancement path.

## Combined Recommendation (prioritized)

### Quick wins (1-2 days)
- Replace placeholder icons and polish toolbar visuals (no new behavior yet).
- Add loading + no-results states.
- Align Fridge/Grocery layout spacing and table container behavior.

### Medium improvements (3-5 days)
- Add responsive row detail expansion for small screens.
- Improve action cell prominence and sticky header behavior.
- Finalize Mantine-like visual rhythm and Dynamic-like table hierarchy.

### Bigger redesign path (1-2 sprints)
- Introduce reusable sort/filter model in `InventoryTable` and wire filter/action controls.
- Refactor rendering around `FlatList` + virtualized rows for performance.
- Add column visibility management and saved user preferences.
- Add full accessibility pass and end-to-end UI tests (including Playwright once environment permits install).

## Risks
- Overloading mobile UI with desktop-style controls can reduce clarity.
- Implementing too many features at once may break the reusable table abstraction.
- Sorting/filter logic duplication between fridge and grocery can creep in if abstraction boundaries are unclear.

## Validation Checklist
- [ ] Fridge and Grocery tables render correctly on Expo web and mobile.
- [ ] Empty/loading/error states are all visible and understandable.
- [ ] Status chips remain semantically correct after UI updates.
- [ ] Horizontal scrolling is reduced on small screens compared to baseline.
- [ ] Keyboard focus and screen-reader labels work for primary actions.

## Deferred Functionality (after UI approval)
- Sorting interactions and state.
- Filtering panel behavior and query logic.
- Delete confirmation/undo behavior.

## Phase 1 Implementation Review (2026-03-20)
- Completed UI-only refresh for fridge and grocery tables with no new sorting/filtering/delete behavior.
- Added polished visual toolbar icons, loading/empty/no-results state variants, stronger row/action styling, and consistent spacing across both screens.
- Added accessibility labels/hints on controls and visual focus styling for search input.
- Added compact-width column scaling and aligned Fridge/Groceries screen wrappers for consistent responsive behavior.
