# Requirements: PlayNext Milestone v1.1 — UI Upgrade

**Defined:** 2026-02-23
**Core Value:** Users can discover, search, and play music seamlessly — playback never interrupts navigation, and playlists let users organize their favorite tracks.

## v1.1 Requirements

### Design Foundation

- [x] **DSGN-01**: App renders all text in Inter font loaded via next/font/google with weights 400-800
- [x] **DSGN-02**: CSS design tokens include keyframes for float, pulseGlow, gradientShift, vinylSpin, staggerFadeIn, and breathe animations
- [x] **DSGN-03**: Utility classes exist for glass-card, text-gradient-vivid, noise-overlay, and all animation keyframes
- [x] **DSGN-04**: All infinite animations respect prefers-reduced-motion by pausing or disabling when user preference is set
- [x] **DSGN-05**: Stagger animation delays use a lookup table pattern (not dynamic Tailwind classes) to prevent production purge

### Ambient Color System

- [x] **AMBR-01**: A Next.js API route proxies album art images to bypass iTunes CDN CORS restrictions
- [x] **AMBR-02**: A color extraction utility extracts the dominant color from album art and returns HSL values
- [x] **AMBR-03**: A full-viewport ambient background component renders blurred radial gradients based on the currently playing song's dominant color
- [x] **AMBR-04**: Ambient background smoothly transitions colors when the song changes (CSS transition, 1-2s)
- [x] **AMBR-05**: Ambient background works in both dark and light mode with appropriate opacity levels

### Player Bar

- [ ] **PLYR-01**: Player bar displays larger album art (56px) with a spinning vinyl disk animation behind it when playing
- [ ] **PLYR-02**: Player bar has an animated gradient top border that shifts colors
- [ ] **PLYR-03**: Long song titles scroll with a marquee animation instead of truncating
- [ ] **PLYR-04**: Progress bar uses a vivid gradient track with a persistent glowing thumb dot when playing
- [ ] **PLYR-05**: Play/pause button is larger with a pulse-glow animation when playing
- [ ] **PLYR-06**: Player bar backdrop receives a subtle tint from the ambient color system

### Song Cards

- [ ] **CARD-01**: Song cards fade in with staggered animation on mount (capped at 8 cards max delay)
- [ ] **CARD-02**: Song cards show a subtle border glow and zoom effect on hover
- [ ] **CARD-03**: Song card overlay uses a gradient (transparent to black/70) instead of flat overlay
- [ ] **CARD-04**: Play button on song cards uses gradient styling with pulse-glow when active
- [ ] **CARD-05**: Section headers have a decorative gradient line and stagger slide-in animation

### Header

- [ ] **HEAD-01**: PlayNext logo uses text-gradient-vivid styling with animated underline on hover
- [ ] **HEAD-02**: Search input shows gradient glow border on focus with subtle scale-up micro-animation
- [ ] **HEAD-03**: Header has a subtle bottom gradient glow line for visual separation

### Sidebar & Queue & Playlist

- [ ] **PANL-01**: Sidebar has glassmorphism background with a decorative gradient edge line
- [ ] **PANL-02**: Sidebar active nav indicator uses gradient pill background instead of amber border
- [ ] **PANL-03**: Sidebar nav items have translate-x hover micro-animation
- [ ] **PANL-04**: Queue panel has glassmorphism styling with stagger animation on items
- [ ] **PANL-05**: Queue "now playing" first item has an ambient glow highlight
- [ ] **PANL-06**: Playlist page hero uses dynamic color extracted from first song's album art
- [ ] **PANL-07**: Playlist page shows a 2x2 mosaic of album covers in the hero area

### Search Experience

- [ ] **SRCH-10**: Search input has animated gradient border on focus
- [ ] **SRCH-11**: Top result banner has enhanced glassmorphism with hover scale effect
- [ ] **SRCH-12**: Pre-search state shows genre/mood browsing cards with colorful gradients
- [ ] **SRCH-13**: Search results appear with stagger fade-in animation
- [ ] **SRCH-14**: Currently playing track in search results shows a waveform indicator

### Polish

- [ ] **PLSH-01**: Page transitions use fade-in animation when navigating between routes
- [ ] **PLSH-02**: Toast notifications have glassmorphism styling with slide-up animation
- [ ] **PLSH-03**: Skeleton loading states use wave shimmer animation instead of flat pulse

## Future Requirements

### Visual Enhancements (v1.2+)

- **DSGN-06**: 3D tilt micro-interaction on song cards using mouse position tracking
- **PLYR-07**: Previous track button in player controls
- **PLYR-08**: Buffer indicator on progress bar
- **SRCH-15**: Parallax effect on top result banner background
- **SRCH-16**: Voice search icon placeholder in search input
- **PANL-08**: Mini album art collage at top of queue panel
- **PANL-09**: Playlist song count and total duration stats row

## Out of Scope

| Feature | Reason |
|---------|--------|
| motion/framer-motion library | CSS animations sufficient for v1.1; defer to v1.2 if page transitions need more |
| Real parallax scrolling | Performance risk on mobile, not worth the complexity for v1.1 |
| Custom audio visualizer/waveform | Requires Web Audio API, high complexity, separate milestone |
| Drag-and-drop queue reorder | Listed as v2 requirement from previous milestone |
| AI-adaptive color palettes | Over-engineering for a visual polish milestone |
| Sound effects on interactions | Annoying UX anti-pattern for music apps |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 6 | Complete |
| DSGN-02 | Phase 6 | Complete |
| DSGN-03 | Phase 6 | Complete |
| DSGN-04 | Phase 6 | Complete |
| DSGN-05 | Phase 6 | Complete |
| AMBR-01 | Phase 7 | Complete |
| AMBR-02 | Phase 7 | Complete |
| AMBR-03 | Phase 7 | Complete |
| AMBR-04 | Phase 7 | Complete |
| AMBR-05 | Phase 7 | Complete |
| PLYR-01 | Phase 8 | Pending |
| PLYR-02 | Phase 8 | Pending |
| PLYR-03 | Phase 8 | Pending |
| PLYR-04 | Phase 8 | Pending |
| PLYR-05 | Phase 8 | Pending |
| PLYR-06 | Phase 8 | Pending |
| CARD-01 | Phase 9 | Pending |
| CARD-02 | Phase 9 | Pending |
| CARD-03 | Phase 9 | Pending |
| CARD-04 | Phase 9 | Pending |
| CARD-05 | Phase 9 | Pending |
| HEAD-01 | Phase 10 | Pending |
| HEAD-02 | Phase 10 | Pending |
| HEAD-03 | Phase 10 | Pending |
| SRCH-10 | Phase 10 | Pending |
| SRCH-11 | Phase 10 | Pending |
| SRCH-12 | Phase 10 | Pending |
| SRCH-13 | Phase 10 | Pending |
| SRCH-14 | Phase 10 | Pending |
| PANL-01 | Phase 11 | Pending |
| PANL-02 | Phase 11 | Pending |
| PANL-03 | Phase 11 | Pending |
| PANL-04 | Phase 11 | Pending |
| PANL-05 | Phase 11 | Pending |
| PANL-06 | Phase 11 | Pending |
| PANL-07 | Phase 11 | Pending |
| PLSH-01 | Phase 11 | Pending |
| PLSH-02 | Phase 11 | Pending |
| PLSH-03 | Phase 11 | Pending |

**Coverage:**
- v1.1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0

---
*Requirements defined: 2026-02-23*
*Last updated: 2026-02-23 after milestone v1.1 roadmap creation*
