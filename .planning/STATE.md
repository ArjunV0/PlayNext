# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** Users can discover, search, and play music seamlessly -- playback never interrupts navigation, and playlists let users organize their favorite tracks.
**Current focus:** Milestone v1.1 UI Upgrade -- Phase 7: Ambient Color System

## Current Position

Phase: 7 of 11 (Ambient Color System)
Plan: 1 of 2 in current phase
Status: In Progress — Plan 01 complete, Plan 02 remaining
Last activity: 2026-02-23 -- Completed 07-01-PLAN.md (image proxy + color extractor)

Progress: [████░░░░░░░░░░░░░░░░░░] 14% (6/11 phases complete — Plan 01 of Phase 7 done)

## Performance Metrics

**Velocity (from v1.0):**
- Total plans completed: 12
- Average duration: ~2.8 min
- Total execution time: ~0.5 hours

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| 06-01 | 2m 21s | 2 | 3 |
| 07-01 | 8m | 2 | 5 |

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap v1.1]: Phase 6 must ship first -- all 39 v1.1 animation classes depend on keyframes defined here; prefers-reduced-motion block must exist before any animation class is used anywhere
- [Roadmap v1.1]: Phase 7 (Ambient Color) uses Next.js Route Handler image proxy as primary path (not fallback) -- iTunes CDN CORS is confirmed blocked; validate proxy before any dependent component is built
- [Roadmap v1.1]: Stagger delays use inline style animationDelay (e.g. style={{ animationDelay: `${index * 80}ms` }}) -- never dynamic Tailwind class strings which get purged in production
- [Roadmap v1.1]: AmbientBackground uses mounted guard + SSR false dynamic import to prevent React 19 hydration mismatch
- [Roadmap v1.1]: Ambient color propagated via CSS custom properties on document.documentElement (--ambient-h, --ambient-s, --ambient-l) -- no new React context needed
- [Roadmap v1.1]: Phase 8 plan 08-01 adds data-testid attributes to PlayerBar before DOM restructuring to preserve existing Playwright selectors
- [Phase 6-01]: Inter configured as variable font (no weight array) -- browser fetches full variable font, all weights 400-800 available
- [Phase 6-01]: text-gradient class renamed to text-gradient-vivid (vivid palette: indigo #818cf8, violet #c084fc, pink #f472b6); Header.tsx updated
- [Phase 6-01]: Stagger delays use static CSS lookup table at 120ms intervals (not dynamic Tailwind strings, which get purged in production)
- [Phase 07-ambient-color-system]: Image proxy validates URL hostname must end with .mzstatic.com — rejects arbitrary URLs for security
- [Phase 07-ambient-color-system]: extractColor uses weighted palette average (saturation as weight) with HSL clamping L:25-65%, S floor:30%
- [Phase 07-ambient-color-system]: Silent fallback pattern: extraction errors return FALLBACK_HSL { h:271, s:81, l:56 } without throwing

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 7 pre-work RESOLVED]: iTunes CDN CORS proxy built at /api/image-proxy — validates mzstatic.com URLs, proxies with 24h cache headers
- [Phase 7 pre-work RESOLVED]: colorthief has no DefinitelyTyped types — created types/colorthief.d.ts with declare module
- [Phase 11 pre-work]: Safari backdrop-filter stacking with 4+ overlapping elements has documented rendering bugs -- validate Header + AmbientBackground + Sidebar + PlayerBar stacking in Safari before finalizing glassmorphism scope in Phase 11

## Session Continuity

Last session: 2026-02-23
Stopped at: Completed 07-01-PLAN.md
Resume file: .planning/phases/07-ambient-color-system/07-02-PLAN.md
