# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** Users can discover, search, and play music seamlessly -- playback never interrupts navigation, and playlists let users organize their favorite tracks.
**Current focus:** Milestone v1.1 UI Upgrade -- Phase 8: Player Bar Enhancement

## Current Position

Phase: 8 of 11 (Player Bar Enhancement)
Plan: 2 of 2 in current phase (Phase 8 complete)
Status: Phase 8 complete — all 2 plans done (PlayerBar + PlayerProgress + PlayerControls visual upgrade)
Last activity: 2026-02-23 -- Completed 08-02-PLAN.md (PlayerProgress vivid gradient + PlayerControls ambient play button)

Progress: [█████░░░░░░░░░░░░░░░░░] 18% (7/11 phases complete — Phase 7 Ambient Color System done)

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
| 07-02 | 2min | 2 | 3 |
| Phase 08-player-bar-upgrade P02 | 7 | 2 tasks | 2 files |
| Phase 08-player-bar-upgrade P01 | 8min | 2 tasks | 2 files |

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
- [Phase 07]: AmbientBackground uses isMounted guard + ssr:false dynamic import for double React 19 hydration protection
- [Phase 07]: latestUrlRef queue-and-settle: async extractColor result only applied if URL hasn't changed since dispatch
- [Phase 07]: CSS custom properties written to document.documentElement so downstream phases need no React context coupling
- [Phase 08-player-bar-upgrade]: Play button uses inline style for ambient gradient — CSS calc() on custom properties requires inline style in Tailwind v4
- [Phase 08-player-bar-upgrade]: animate-pulse-glow class toggled via className template literal for instant play/pause start-stop
- [Phase Phase 08-01]: MarqueeText uses span elements only (not div) to safely nest inside p.font-medium without invalid HTML, preserving E2E selector
- [Phase Phase 08-01]: Vinyl disk instant-stop: animate-vinyl-spin only applied when isPlaying===true, no deceleration animation
- [Phase Phase 08-01]: Marquee duration computed as scrollWidth/30 for consistent ~30px/s pace; --marquee-duration injected via inline style as React.CSSProperties

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 7 pre-work RESOLVED]: iTunes CDN CORS proxy built at /api/image-proxy — validates mzstatic.com URLs, proxies with 24h cache headers
- [Phase 7 pre-work RESOLVED]: colorthief has no DefinitelyTyped types — created types/colorthief.d.ts with declare module
- [Phase 11 pre-work]: Safari backdrop-filter stacking with 4+ overlapping elements has documented rendering bugs -- validate Header + AmbientBackground + Sidebar + PlayerBar stacking in Safari before finalizing glassmorphism scope in Phase 11

## Session Continuity

Last session: 2026-02-23
Stopped at: Completed 08-01-PLAN.md (PlayerBar vinyl disk, marquee, gradient border, ambient tint)
Resume file: .planning/phases/08-player-bar-upgrade/08-02-PLAN.md
