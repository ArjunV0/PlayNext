---
phase: 07-ambient-color-system
plan: 01
subsystem: api
tags: [colorthief, canvas, image-proxy, color-extraction, hsl, cors, next-js-route-handler]

# Dependency graph
requires:
  - phase: 06-css-foundation
    provides: animate-breathe keyframe for idle fallback state used in Plan 02
provides:
  - Image proxy route at /api/image-proxy validating mzstatic.com URLs with 24h caching
  - Color extraction utility with weighted palette average, HSL clamping, in-memory cache, and violet fallback
  - TypeScript module declaration for colorthief
affects:
  - 07-02 (AmbientBackground component consumes extractColor and FALLBACK_HSL)
  - 08-11 (all phases consume --ambient-h/s/l CSS custom properties set by AmbientBackground)

# Tech tracking
tech-stack:
  added: [colorthief@2.6.0]
  patterns:
    - Next.js Route Handler with Zod URL validation restricting to mzstatic.com domain
    - AbortController with 5s timeout for upstream fetch
    - Module-level Map cache keyed by artwork URL
    - Weighted HSL average favoring saturated palette colors
    - Silent fallback to violet default on any extraction error

key-files:
  created:
    - app/api/image-proxy/route.ts
    - lib/colorExtractor.ts
    - types/colorthief.d.ts
  modified:
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Image proxy validates URL hostname must end with .mzstatic.com — rejects arbitrary URLs for security"
  - "AbortController timeout set at 5 seconds for upstream image fetch"
  - "Canvas drawn at 64x64 for performance; ColorThief getPalette called on loaded img element directly"
  - "Weighted palette average uses saturation as weight (hsl.s + 1) — saturated colors dominate final hue"
  - "Lightness clamped to 25-65%, saturation floored at 30% per CONTEXT.md safe range"

patterns-established:
  - "Proxy-first pattern: all iTunes CDN image fetches route through /api/image-proxy to bypass CORS"
  - "Silent fallback pattern: extraction errors return FALLBACK_HSL without throwing or logging"

requirements-completed: [AMBR-01, AMBR-02]

# Metrics
duration: 8min
completed: 2026-02-23
---

# Phase 7 Plan 01: Ambient Color System Summary

**iTunes CDN image proxy with mzstatic.com validation and canvas-based weighted HSL color extractor with in-memory caching and violet fallback**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-23T04:53:00Z
- **Completed:** 2026-02-23T05:01:52Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created /api/image-proxy Route Handler that validates URLs (mzstatic.com only), proxies with 24h cache headers, and handles upstream errors as 502
- Created lib/colorExtractor.ts with weighted palette average, lightness clamping (25-65%), saturation floor (30%), module-level Map cache, and silent violet fallback
- Added TypeScript declaration for colorthief enabling type-safe imports across the codebase

## Task Commits

Each task was committed atomically:

1. **Task 1: Image proxy route and colorthief type declaration** - `1f10f65` (feat)
2. **Task 2: Color extraction utility with caching and fallback** - `d738fbe` (feat)

## Files Created/Modified
- `app/api/image-proxy/route.ts` - GET Route Handler proxying mzstatic.com images with CORS and cache headers
- `lib/colorExtractor.ts` - Async extractColor() returning HSL from weighted palette average, with cache and fallback
- `types/colorthief.d.ts` - Module declaration for colorthief with getColor/getPalette signatures
- `package.json` - Added colorthief@^2.6.0 dependency
- `pnpm-lock.yaml` - Lock file updated

## Decisions Made
- Used `hostname.endsWith(".mzstatic.com")` check inside Zod refine for security — rejects arbitrary URL proxying
- CANVAS_SIZE=64 used to create offscreen canvas before ColorThief call (performance), but img element passed directly to getPalette per ColorThief's HTMLImageElement requirement
- Weighted average uses `hsl.s + 1` as weight (+1 prevents zero-weight for fully desaturated colors)
- Kept FALLBACK_HSL exported so Plan 02's AmbientBackground can use it for the initial idle state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `pnpm run typecheck` invoked a non-project tsc shim — used `node ./node_modules/typescript/bin/tsc --noEmit` directly to run the real compiler. TypeScript checks pass cleanly.
- Prettier reformatted trailing comma and line wrap in route.ts and colorthief.d.ts after initial commit — fixed and included in Task 2 commit.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /api/image-proxy route is live and ready for Plan 02's AmbientBackground to use
- extractColor() and FALLBACK_HSL are exported from lib/colorExtractor.ts
- Plan 02 can import both and begin setting --ambient-h/s/l CSS custom properties on document.documentElement

---
*Phase: 07-ambient-color-system*
*Completed: 2026-02-23*

## Self-Check: PASSED

- app/api/image-proxy/route.ts: FOUND
- lib/colorExtractor.ts: FOUND
- types/colorthief.d.ts: FOUND
- 07-01-SUMMARY.md: FOUND
- Commit 1f10f65 (feat(proxy): Add image proxy route and types): FOUND
- Commit d738fbe (feat(color): Add color extractor utility): FOUND
