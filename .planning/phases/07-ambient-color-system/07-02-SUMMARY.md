---
phase: 07-ambient-color-system
plan: 02
subsystem: ui

tags: [ambient, gradient, css-custom-properties, color-extraction, react, dynamic-import, hydration-guard]

# Dependency graph
requires:
  - phase: 07-01
    provides: extractColor(), FALLBACK_HSL, and /api/image-proxy for artwork color extraction
  - phase: 06-css-foundation
    provides: animate-breathe keyframe used on the ambient div

provides:
  - Full-viewport ambient gradient background tinted by current song's dominant color
  - CSS custom properties --ambient-h, --ambient-s, --ambient-l written to :root for downstream consumers
  - Queue-and-settle dedup via latestUrlRef preventing color flicker on rapid skipping
  - Pause-state opacity dim as visual feedback
  - SSR-safe via mounted guard + dynamic import ssr:false

affects:
  - 08-11 (all subsequent phases consume --ambient-h/s/l from :root)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Mounted guard (isMounted state) preventing React 19 hydration mismatch
    - Queue-and-settle via useRef: only the latest song's color wins on rapid skip
    - CSS custom property writes to document.documentElement for cross-component ambient color
    - Dynamic import with ssr:false double-protecting against SSR execution
    - Tailwind conditional opacity classes for pause-state dimming (no inline opacity override)
    - Constants GRADIENT_ALPHA_1/2 for named gradient alpha values

key-files:
  created:
    - features/ambient/AmbientBackground.tsx
    - features/ambient/index.ts
  modified:
    - app/(app)/layout.tsx

key-decisions:
  - "AmbientBackground uses isMounted guard + ssr:false dynamic import for double React 19 hydration protection"
  - "latestUrlRef queue-and-settle: async extractColor result only applied if URL hasn't changed since dispatch"
  - "CSS custom properties written to document.documentElement so downstream phases need no React context coupling"
  - "Gradient alpha constants GRADIENT_ALPHA_1=0.5, GRADIENT_ALPHA_2=0.3 — named to avoid magic numbers"
  - "Pause-dim handled via Tailwind opacity classes, not inline style — allows CSS transition on opacity"

# Metrics
duration: 2min
completed: 2026-02-23
---

# Phase 7 Plan 02: AmbientBackground Component Summary

**Full-viewport ambient gradient driven by album art dominant color, writing --ambient-h/s/l to :root via CSS custom properties, with queue-and-settle dedup and pause-state dim**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-23T05:05:04Z
- **Completed:** 2026-02-23T05:06:52Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `features/ambient/AmbientBackground.tsx` as a `"use client"` component with:
  - Mounted guard (`isMounted`) preventing React 19 hydration mismatch
  - Color extraction effect using `extractColor()` from `lib/colorExtractor`
  - Queue-and-settle dedup via `latestUrlRef` — only the latest song's color wins on rapid skip
  - CSS custom property writes to `document.documentElement` for `--ambient-h`, `--ambient-s`, `--ambient-l`
  - Cleanup on unmount removes all three CSS properties
  - Pause-state dim via conditional Tailwind opacity classes
  - Smooth 1.2s ease-out background transition + 0.8s opacity transition
  - `animate-breathe` class for idle breathing animation
  - `FALLBACK_HSL` (violet) as default when no song or extraction fails
- Created `features/ambient/index.ts` barrel export
- Updated `app/(app)/layout.tsx` with SSR-disabled dynamic import placed before `<Sidebar>` inside `<AuthGuard>`

## Task Commits

1. **Task 1: AmbientBackground component** - `e3fd752` (feat)
2. **Task 2: Layout integration + prettier fix** - `b9ea2cc` (feat)

## Files Created/Modified

- `features/ambient/AmbientBackground.tsx` - Client component with gradient rendering, color extraction, CSS var writes
- `features/ambient/index.ts` - Barrel export for ambient feature
- `app/(app)/layout.tsx` - Added dynamic AmbientBackground import with ssr:false

## Decisions Made

- Used named constants `GRADIENT_ALPHA_1 = 0.5` and `GRADIENT_ALPHA_2 = 0.3` instead of inline magic numbers per wednesday-dev skill
- Pause-dim uses Tailwind opacity class toggle (not inline style) so the CSS `transition` on opacity applies correctly
- `latestUrlRef` tracks the most recently requested URL — the async `.then()` callback checks if it still matches before calling `setCurrentHsl`, preventing stale color flicker
- Cleanup effect on unmount removes CSS custom properties cleanly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Formatting] Prettier reformatted AmbientBackground.tsx className attribute ordering**
- **Found during:** Task 2 verification (prettier --check)
- **Issue:** Prettier reordered Tailwind classes in className (sorted `animate-breathe pointer-events-none` vs original `fixed inset-0 -z-10 pointer-events-none animate-breathe`)
- **Fix:** Ran `npx prettier --write` on the file and included the fix in the Task 2 commit
- **Files modified:** `features/ambient/AmbientBackground.tsx`
- **Commit:** b9ea2cc

## User Setup Required

None.

## Next Phase Readiness

- `--ambient-h`, `--ambient-s`, `--ambient-l` are live on `:root` whenever a song is playing
- All subsequent phases (08-11) can read these properties without any React context
- AmbientBackground is mounted in the shared app layout — persists across page navigation
- The breathe animation is already running with the violet fallback on app load

---
*Phase: 07-ambient-color-system*
*Completed: 2026-02-23*

## Self-Check: PASSED

- features/ambient/AmbientBackground.tsx: FOUND
- features/ambient/index.ts: FOUND
- app/(app)/layout.tsx contains AmbientBackground: FOUND
- app/(app)/layout.tsx contains ssr: false: FOUND
- Commit e3fd752 (feat(ambient): Add AmbientBackground component): FOUND
- Commit b9ea2cc (feat(layout): Integrate AmbientBackground via dynamic import): FOUND
