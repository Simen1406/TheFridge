# Backend Tasks - Receipt Download (Trumf + REMA1000)

## Plan

- [ ] Baseline current Trumf receipt flow in `backend` (auth/session handling, fetch endpoints, parsing, persistence) and document exact failure points.
- [ ] Stabilize Trumf login/session lifecycle so receipt fetch works across typical edge cases (expired session, missing MFA step, transient HTTP failures).
- [ ] Finalize Trumf receipt extraction pipeline: normalize fields, deduplicate by stable receipt key, and map to backend response model.
- [ ] Add duplicate-download guard in `scripts/trumf/download_recipets.py`: before downloading a receipt, check whether it already exists locally (same stable receipt key/filename) and skip with clear log message.
- [ ] Add or tighten backend tests for Trumf flow (happy path + key failure paths) using existing test patterns.
- [ ] Add observability for Trumf runs (structured logs with safe/redacted identifiers) to speed up debugging.
- [x] Investigate REMA1000 receipt access options: official APIs, web portal endpoints, export formats, and authentication constraints.
- [ ] Build a REMA1000 feasibility note with concrete integration options:
  - Option A: direct API integration (if available)
  - Option B: web-session based retrieval
  - Option C: manual/CSV/PDF import fallback
- [ ] If feasible, implement a minimal REMA1000 prototype fetcher that retrieves at least one receipt and maps it to the shared receipt schema.
- [ ] Verify backend quality gates (tests, lint, type checks/build if available) and document pass/fail with blockers.
- [ ] Document outcomes in this file `## Review` section: what works, what does not, risks, and next actions.

## Review

- REMA1000 investigation started (2026-03-26):
  - Official REMA developer portal exists, but terms and visible portal structure indicate product/store API usage and API key access; no public receipt endpoint is exposed in portal pages.
  - REMA customer FAQ confirms app receipts exist for normal purchases, but states legal validity caveat; Skann & Betal receipts are treated differently (juridically valid).
  - REMA support states missing receipts can be requested via customer service (up to 1 year centrally), which is a viable fallback data source when direct integration is not available.
  - Trumf and REMA1000 appear to be separate ecosystems for loyalty/receipt flows; current Trumf script should not be assumed to cover REMA1000 receipts.
- Feasibility options for backend:
  - Option A (public API): Low feasibility now. Keep as pending only if REMA grants explicit partner access for receipt data.
  - Option B (session-based app/web retrieval): Medium feasibility, high maintenance/risk. Likely requires reverse-engineering authenticated app traffic and careful ToS/privacy review.
  - Option C (manual import fallback): High feasibility. Support upload/import of receipt files or structured export shared from user app/email.
  - Option D (assisted support flow): Medium feasibility. Let user trigger "request receipt from REMA support" workflow metadata in app, then import when received.
- Recommended execution order:
  - 1) Implement Option C import path to unblock feature delivery.
  - 2) Parallel-spike Option B for technical viability only (no production dependency).
  - 3) Pursue Option A only with official permission/documentation from REMA.
