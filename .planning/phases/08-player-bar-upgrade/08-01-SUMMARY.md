---
phase: 08-player-bar-upgrade
plan: 01
subsystem: ui
tags: [react, tailwind, css-animation, marquee, vinyl, ambient-color, player-bar]

# Dependency graph
requires:
  - phase: 06-css-foundation
    provides: "animate-vinyl-spin keyframe, animate-gradient-shift utility, CSS animation infrastructure"
  - phase: 07-ambient-color-system
    provides: "--ambient-h, --ambient-s, --ambient-l CSS custom properties on document.documentElement"
provides:
  - "Marquee keyframe (@keyframes marquee) and .animate-marquee utility in tailwind.css"
  - "Restructured PlayerBar with 56px vinyl disk album art, animated gradient top border, marquee text scrolling, and ambient radial tint"
affects: [08-02-player-bar-upgrade, e2e-tests, phase-11-glassmorphism]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "MarqueeText component (local to PlayerBar.tsx) uses span elements only so it can be nested inside <p> without invalid HTML"
    - "CSS custom property --marquee-duration dynamically set via inline style to achieve consistent ~30px/s scroll pace"
    - "Vinyl disk uses CSS radial-gradient with concentric stop pairs for groove ring effect"
    - "Ambient tint opacity controlled via Tailwind dark: variant (opacity-[0.05] light, opacity-[0.10] dark) with background alpha=1"

key-files:
  created: []
  modified:
    - "styles/tailwind.css"
    - "features/player/PlayerBar.tsx"

key-decisions:
  - "MarqueeText uses <span> elements (not <div>) so it can nest inside <p className='font-medium'> without invalid HTML, preserving the E2E selector p.font-medium"
  - "Vinyl disk instant-stop: animate-vinyl-spin only applied when isPlaying is true, no deceleration — responsive and snappy"
  - "Gradient border uses animate-gradient-shift with backgroundSize override to 200% 100% for horizontal-only shift (not diagonal)"
  - "Marquee duration computed as scrollWidth/30 for consistent ~30px/s pace regardless of text length"

patterns-established:
  - "Local sub-component pattern: MarqueeText defined in same file as PlayerBar — player-bar-specific, not re-exported"
  - "CSS custom property injection for animation timing: --marquee-duration set via inline style as React.CSSProperties cast"

requirements-completed: [PLYR-01, PLYR-02, PLYR-03, PLYR-06]

# Metrics
duration: 8min
completed: 2026-02-23
---

# Phase 8 Plan 01: Player Bar Upgrade Summary

**PlayerBar upgraded with 56px vinyl disk album art (grooved CSS radial-gradient), animated gradient top border, marquee scrolling for overflow title/artist, and ambient radial tint from Phase 7's CSS custom properties**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-23T05:24:24Z
- **Completed:** 2026-02-23T05:32:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added `@keyframes marquee` and `.animate-marquee` utility to tailwind.css with CSS custom property duration support and reduced-motion override
- Restructured PlayerBar outer container: replaced static border with animated gradient top border using `animate-gradient-shift`
- Added ambient tint overlay using `--ambient-h/s/l` CSS custom properties (5% opacity light, 10% dark) with 1200ms transition
- Album art scaled from 40px to 56px with vinyl disk behind it (CSS radial-gradient concentric grooves), spinning only when `isPlaying` is true
- MarqueeText local component uses span elements to safely nest inside `<p>` preserving E2E selector `p.font-medium`
- All existing Playwright E2E selectors preserved: `.fixed.bottom-0`, `p.font-medium`, `[role='progressbar']`, `aria-label` buttons

## Task Commits

Each task was committed atomically:

1. **Task 1: Add marquee keyframe and utility class** - `8157eb5` (feat)
2. **Task 2: Restructure PlayerBar with vinyl, marquee, gradient border, and ambient tint** - `e78d2b4` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `styles/tailwind.css` - Added `@keyframes marquee`, `.animate-marquee` utility (with `--marquee-duration` and `--marquee-delay` custom properties), and `.animate-marquee` reduced-motion override
- `features/player/PlayerBar.tsx` - Full restructure: vinyl disk with CSS radial-gradient, 56px album art, animated gradient top border, ambient tint overlay, MarqueeText local component for title/artist

## Decisions Made
- Used `<span>` elements throughout MarqueeText (not `<div>`) so it can be nested inside `<p className="font-medium">` without invalid HTML (block-in-inline is valid; div-in-p is not)
- Vinyl disk instant-stop implemented by conditionally applying `animate-vinyl-spin` class only when `isPlaying === true` — no CSS transition or deceleration
- Marquee duration dynamically computed from `textEl.scrollWidth / 30` to maintain consistent ~30px/s regardless of text length
- Gradient border background-size overridden to `200% 100%` (horizontal only) while `animate-gradient-shift` keyframe shifts via background-position

## Deviations from Plan

None - plan executed exactly as written. The Prettier formatting auto-fix was a routine format correction (not a deviation from plan logic).

## Issues Encountered
- Prettier reformatted className order (e.g., `size-14 shrink-0` to `size-14 shrink-0`) — auto-fixed by running `prettier --write` before commit
- TypeScript tsc binary resolves to `tsc@2.0.4` (fake npm package) — ran TypeScript directly from pnpm store path instead

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 08-02 can begin: PlayerBar is restructured with all visual upgrades
- All E2E selectors preserved — no test modifications needed
- CSS custom properties `--ambient-h/s/l` are consumed — Phase 7's AmbientBackground component continues to supply them unchanged

---
*Phase: 08-player-bar-upgrade*
*Completed: 2026-02-23*
