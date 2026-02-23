# Roadmap: PlayNext

## Milestones

- [x] **v1.0 MVP** - Phases 1-5 (shipped 2026-02-20)
- [ ] **v1.1 UI Upgrade** - Phases 6-11 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-5) — SHIPPED 2026-02-20</summary>

- [x] **Phase 1: Foundation** - Unified Song type, route group layout, and extracted Header component (completed 2026-02-20)
- [x] **Phase 2: Queue System** - Queue context, queue panel UI, and manual queue management (completed 2026-02-20)
- [x] **Phase 3: Sidebar Navigation** - Hamburger menu, sidebar with nav links, profile section, and active page indicator (completed 2026-02-20)
- [x] **Phase 4: Playlist Management** - Supabase-backed playlist CRUD, add/remove songs, play from playlist, shuffle, and sidebar playlist list (completed 2026-02-20)
- [x] **Phase 5: Full-Page Search** - Dedicated /search route with URL-driven results, persistent playback, and all song card actions (completed 2026-02-20)

### Phase 1: Foundation
**Goal**: All features share a single Song type and a common authenticated layout, eliminating duplicate definitions and enabling shared UI scaffolding for subsequent phases
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03
**Success Criteria** (what must be TRUE):
  1. Every component that references a song uses the same Song type from a single source file -- no duplicate song interfaces exist anywhere in the codebase
  2. All authenticated pages render inside a shared layout that includes a header area, a sidebar slot, and the persistent player bar at the bottom
  3. The Header is a standalone reusable component that can be imported independently, not inline markup repeated across pages
  4. Existing playback continues to work after the layout restructuring -- playing a song on the home page and navigating does not interrupt audio
**Plans**: Pre-GSD (verified via code review 2026-02-20)

Plans:
- [x] Unified Song type into lib/types.ts
- [x] Route group layout with app shell
- [x] Extracted Header into standalone component

### Phase 2: Queue System
**Goal**: Users can see, control, and modify what plays next -- the queue is the backbone that playlists and search will push songs into
**Depends on**: Phase 1
**Requirements**: QUEU-01, QUEU-02, QUEU-03, QUEU-04, QUEU-05, QUEU-06, QUEU-07
**Success Criteria** (what must be TRUE):
  1. User can open a slide-over queue panel and see the ordered list of upcoming songs
  2. User can skip to the next song in the queue and the queue advances correctly
  3. When a user plays a song from the home page, the remaining songs from that section auto-populate the queue
  4. User can manually add any song to the queue via an "Add to Queue" action on a song card, and manually added songs play before context-queued songs
  5. User can remove an individual song from the queue or clear the entire queue
**Plans**: Pre-GSD (verified via code review 2026-02-20)

Plans:
- [x] Dual-queue system with manual and context queues
- [x] QueuePanel slide-over component
- [x] Queue toggle button in PlayerBar
- [x] Add to Queue action on SongCard

### Phase 3: Sidebar Navigation
**Goal**: Users can navigate the app through a sidebar that provides quick access to all sections, with visual feedback on their current location
**Depends on**: Phase 2
**Requirements**: NAVI-01, NAVI-02, NAVI-03, NAVI-04, NAVI-06
**Success Criteria** (what must be TRUE):
  1. User can open and close a sidebar by clicking a hamburger menu button in the header
  2. Sidebar shows navigation links to Home and Search, and clicking them navigates to the correct page
  3. The currently active page is visually highlighted in the sidebar navigation
  4. Sidebar displays the authenticated user's name and avatar in a profile section
  5. Player bar remains visible and audio continues playing uninterrupted while the sidebar is open and during all navigation
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md -- Sidebar navigation module (components, animations, search stub)
- [x] 03-02-PLAN.md -- Sidebar integration (header trigger, layout wiring, PlayerBar z-index)

### Phase 4: Playlist Management
**Goal**: Users can create playlists, populate them with songs, and play them back -- playlists are the primary way users organize and revisit music they like
**Depends on**: Phase 3
**Requirements**: PLAY-01, PLAY-02, PLAY-03, PLAY-04, PLAY-05, PLAY-06, PLAY-07, PLAY-08, PLAY-09, NAVI-05
**Success Criteria** (what must be TRUE):
  1. User can create a playlist with a name and delete it (with confirmation), and both actions persist across page reloads
  2. User can add a song to a playlist from any song card via a hover action showing a dropdown of their playlists, and remove a song from within the playlist view
  3. User can view a playlist page that lists all its songs, shows the song count, and displays a helpful empty state when the playlist has no songs
  4. User can click a song in a playlist to play it and the remaining playlist songs automatically populate the queue
  5. When shuffle is enabled while playing from a playlist, songs play in random order drawn only from that playlist
  6. The sidebar lists all of the user's playlists for quick navigation into any playlist
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md -- Supabase client, playlist types, and PlaylistContext with CRUD operations
- [x] 04-02-PLAN.md -- Playlist page (hero header, song table, empty state), create/delete dialogs, and sidebar playlist list
- [x] 04-03-PLAN.md -- Add-to-playlist dropdown on song cards, play-from-playlist queue wiring, and shuffle mode

### Phase 5: Full-Page Search
**Goal**: Users can search for music on a dedicated page with full results, persistent playback, and access to all song actions (play, queue, add to playlist)
**Depends on**: Phase 4
**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05, SRCH-06
**Success Criteria** (what must be TRUE):
  1. User can type a query and see results on a dedicated /search page instead of a dropdown panel
  2. Search is URL-driven (/search?q=term) -- bookmarking or sharing the URL reproduces the same search results
  3. Playing a song from search results does not cause navigation away from the search page, and playback continues if the user navigates elsewhere
  4. Recent search history continues to work, and the user can clear the search input with a single click
  5. When a search returns no results, the user sees a friendly empty state rather than a blank page
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md -- Search infrastructure (URL-driven SearchProvider, API pagination, header redirect, sidebar query preservation)
- [x] 05-02-PLAN.md -- Full search page UI (hybrid layout, infinite scroll, pre-search state, no-results state, all song actions)

</details>

---

### v1.1 UI Upgrade (In Progress)

**Milestone Goal:** Transform PlayNext from a functional music player into a visually premium experience with ambient color extraction, glassmorphism, micro-animations, and polished interactive states throughout every surface.

- [x] **Phase 6: CSS Foundation** - Inter font, all animation keyframes, glass/gradient utilities, and reduced-motion accessibility infrastructure (completed 2026-02-23)
- [x] **Phase 7: Ambient Color System** - Image proxy route, canvas-based color extraction, and full-viewport AmbientBackground component (completed 2026-02-23)
- [x] **Phase 8: Player Bar Upgrade** - Vinyl animation, enlarged album art, gradient border, ambient tint, vivid progress bar, and pulse-glow play button (completed 2026-02-23)
- [ ] **Phase 9: Song Cards and Home** - Stagger entry animations, border glow on hover, gradient overlay, gradient play button, and section header accents
- [ ] **Phase 10: Header and Search** - Gradient logo, search focus glow, genre discovery cards, staggered results, waveform indicator, and enhanced top result banner
- [ ] **Phase 11: Panels and Polish** - Sidebar glassmorphism, queue panel styling, playlist hero gradient, page transitions, glassmorphism toasts, and wave shimmer skeletons

## Phase Details

### Phase 6: CSS Foundation
**Goal**: Every animation class, glass utility, and design token the rest of the milestone depends on is defined in a single CSS pass — establishing the vocabulary all subsequent phases speak
**Depends on**: Phase 5
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05
**Success Criteria** (what must be TRUE):
  1. All app text renders in Inter (including weights 400-800) with no layout shift on load
  2. Animation utility classes (animate-float, animate-pulse-glow, animate-gradient-shift, animate-vinyl-spin, animate-stagger-fade-in, animate-breathe) are available and apply their named keyframes in the browser
  3. Glass-card, text-gradient-vivid, and noise-overlay utility classes produce their intended visual results when applied to any element
  4. All six animation classes pause or disable automatically when the user has set prefers-reduced-motion in their OS settings
  5. Stagger delay lookup classes (delay-100 through delay-640) are present in the built CSS and not purged in production
**Plans**: 1 plan

Plans:
- [ ] 06-01-PLAN.md -- Inter font, animation keyframes, glass/gradient/noise utilities, stagger delay lookup table, prefers-reduced-motion block

### Phase 7: Ambient Color System
**Goal**: The app reads the dominant color from each song's album art and writes it as CSS custom properties so every subsequent phase can passively consume a live ambient color without any React re-renders
**Depends on**: Phase 6
**Requirements**: AMBR-01, AMBR-02, AMBR-03, AMBR-04, AMBR-05
**Success Criteria** (what must be TRUE):
  1. Changing the playing song causes the full-viewport background gradient to visibly shift to a hue matching the new album art within 2 seconds
  2. The ambient gradient transitions smoothly between songs rather than cutting abruptly (no flash)
  3. Ambient background is visible and appropriately tinted in both dark mode and light mode
  4. When color extraction fails (CORS error, broken image URL), the app falls back to a violet default color and never crashes or shows a blank background
  5. Navigating between pages does not disrupt the ambient background — it remains stable and color-accurate throughout
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md -- Image proxy route (/api/image-proxy), colorthief type declaration, and colorExtractor.ts utility (weighted palette average, HSL output, lightness clamping, saturation floor, in-memory cache, fallback)
- [ ] 07-02-PLAN.md -- AmbientBackground component (mounted guard, CSS var writes to :root, fixed -z-10 gradient div, queue-and-settle rapid skip, pause dim) and layout integration via dynamic import

### Phase 8: Player Bar Upgrade
**Goal**: The player bar — always visible at the bottom of every page — looks and feels premium: album art is larger, the vinyl spins, the gradient border pulses, and the progress bar invites interaction
**Depends on**: Phase 7
**Requirements**: PLYR-01, PLYR-02, PLYR-03, PLYR-04, PLYR-05, PLYR-06
**Success Criteria** (what must be TRUE):
  1. Album art in the player bar displays at 56px and shows a spinning vinyl ring behind it that stops when playback is paused
  2. A gradient top border on the player bar visibly shifts colors during playback
  3. Song titles longer than the available display width scroll horizontally via marquee animation rather than truncating with an ellipsis
  4. The progress bar track uses a vivid gradient (indigo to violet to pink) and the thumb dot is always visible while a song is playing — not only on hover
  5. The play/pause button is visibly larger than surrounding controls and shows a pulsing glow effect while audio is playing
  6. The player bar background carries a subtle tint matching the ambient color of the currently playing song
**Plans**: 2 plans

Plans:
- [ ] 08-01-PLAN.md -- PlayerBar structural upgrades (vinyl ring, enlarged art, gradient border, marquee text, ambient tint, data-testid attributes)
- [ ] 08-02-PLAN.md -- PlayerProgress vivid gradient + persistent thumb, PlayerControls larger play button + pulse-glow animation

### Phase 9: Song Cards and Home
**Goal**: The home page grid of song cards feels alive — cards stagger into view on load, respond expressively to hover, and each section is visually anchored by a decorative header treatment
**Depends on**: Phase 6
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05
**Success Criteria** (what must be TRUE):
  1. Song cards on the home page appear one after another with a staggered fade-in animation on page load, with each successive card starting its animation slightly later than the previous (capped at 8 cards)
  2. Hovering a song card produces a visible border glow and the album art zooms slightly — the card does not shift layout position during the effect
  3. The hover overlay on song cards transitions from fully transparent at the top to dark at the bottom rather than appearing as a flat dark rectangle
  4. The play button on an active (currently playing) song card shows a gradient fill and a pulsing glow — matching the premium style of the player bar controls
  5. Each home section header has a decorative gradient accent line below it, and section titles slide in from the left when the page loads
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md -- SongCard stagger fade-in animation, ambient border glow hover, gradient overlay, active play button with pulse-glow
- [ ] 09-02-PLAN.md -- SongSection header gradient accent line + slide-in animation, flat shimmer skeleton cards

### Phase 10: Header and Search Experience
**Goal**: The header presents a polished brand identity and the search feature has a visual identity of its own — from an animated focus state to genre browsing cards and a waveform indicator on the playing result
**Depends on**: Phase 6
**Requirements**: HEAD-01, HEAD-02, HEAD-03, SRCH-10, SRCH-11, SRCH-12, SRCH-13, SRCH-14
**Success Criteria** (what must be TRUE):
  1. The PlayNext logo text displays with a vivid multi-color gradient and shows an animated underline on hover
  2. Focusing the search input produces a visible gradient glow border and the input scales up slightly — the effect is immediate and reverses on blur
  3. A subtle gradient glow line is visible beneath the header, separating it from page content
  4. Before the user types anything, the search page shows a grid of genre/mood browsing cards, each with a distinct colorful gradient background
  5. When search results appear, they animate in with a staggered fade — not all at once — and the currently playing track shows an animated waveform indicator in its row
  6. The top result banner uses enhanced glassmorphism and scales up slightly on hover
**Plans**: TBD

Plans:
- [ ] 10-01: Header gradient logo + animated underline + search focus glow + gradient separator line
- [ ] 10-02: Search pre-search genre cards + staggered result rows + waveform playing indicator + TopResultBanner glassmorphism upgrade

### Phase 11: Panels and Polish
**Goal**: Every secondary surface (sidebar, queue panel, playlist hero) receives consistent glassmorphism treatment, and the final layer of polish — page transitions, glassmorphism toasts, and wave shimmer skeletons — brings the entire app to a premium finish
**Depends on**: Phase 7, Phase 10
**Requirements**: PANL-01, PANL-02, PANL-03, PANL-04, PANL-05, PANL-06, PANL-07, PLSH-01, PLSH-02, PLSH-03
**Success Criteria** (what must be TRUE):
  1. The sidebar has a frosted glass background with a decorative gradient edge line, active nav items use a gradient pill indicator, and nav items shift slightly to the right on hover
  2. The queue panel has glassmorphism styling with a stagger animation on items — the currently playing item is visually distinguished by an ambient glow highlight
  3. A playlist's hero section displays a 2x2 mosaic of album covers and uses a gradient derived from the first song's album art as the hero background color
  4. Navigating between routes produces a smooth fade-in on the page content area — layout chrome (header, player bar) does not flash or re-animate
  5. Toast notifications appear with a glassmorphism background and slide up from the bottom rather than appearing instantly
  6. Skeleton loading states throughout the app use a wave shimmer sweep animation instead of a flat pulsing opacity effect
**Plans**: TBD

Plans:
- [ ] 11-01: Sidebar glassmorphism (gradient edge, gradient active pill, hover translate micro-animation)
- [ ] 11-02: Queue panel glassmorphism + stagger animation + now-playing ambient glow highlight
- [ ] 11-03: Playlist hero dynamic gradient + 2x2 album art mosaic
- [ ] 11-04: Page transition fade-in + glassmorphism toasts + wave shimmer skeleton replacement

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9 → 10 → 11
Note: Phase 9 depends only on Phase 6 (not Phase 7 or 8) and may execute in parallel with Phase 8 if needed.
Phase 11 depends on Phase 7 (ambient vars for playlist hero) and Phase 10 (full token set).

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-02-20 |
| 2. Queue System | v1.0 | 4/4 | Complete | 2026-02-20 |
| 3. Sidebar Navigation | v1.0 | 2/2 | Complete | 2026-02-20 |
| 4. Playlist Management | v1.0 | 3/3 | Complete | 2026-02-20 |
| 5. Full-Page Search | v1.0 | 2/2 | Complete | 2026-02-20 |
| 6. CSS Foundation | 1/1 | Complete   | 2026-02-23 | - |
| 7. Ambient Color System | 2/2 | Complete    | 2026-02-23 | - |
| 8. Player Bar Upgrade | 2/2 | Complete   | 2026-02-23 | - |
| 9. Song Cards and Home | v1.1 | 0/2 | Not started | - |
| 10. Header and Search | v1.1 | 0/2 | Not started | - |
| 11. Panels and Polish | v1.1 | 0/4 | Not started | - |
