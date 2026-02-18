# PlayNext

A minimal music preview web app built with Next.js 15 and the iTunes Search API.

## What it does

PlayNext lets you browse curated song sections, search for music, and play 30-second iTunes previews — all in a clean, responsive interface with dark mode support.

### Features

- **Home Sections** — Three curated sections on load: Selected For You, Top Hits Global, and Top Hits India (powered by iTunes Search API)
- **Song Cards** — Album artwork, title, and artist displayed in a responsive grid (2/3/6 columns)
- **Song Modal** — Click any card to see a detail modal with Play and Close actions
- **Audio Player** — Fixed bottom bar with play/pause, next, volume slider, progress bar with seek, and auto-play toggle
- **Search** — Debounced search input with recent search history (persisted in localStorage) and recommended songs fallback
- **Dark Mode** — System-detected theme with manual toggle, persisted preference, no hydration flicker
- **Keyboard Controls** — Spacebar toggles play/pause, Escape closes modals

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for API validation
- [Radix UI](https://www.radix-ui.com/) primitives available
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)
- [ESLint 9](https://eslint.org/) + [Prettier](https://prettier.io/)

## Project Structure

```
app/
  page.tsx              # Home page (client component)
  layout.tsx            # Root layout with providers
  api/
    songs/route.ts      # iTunes proxy — fetches and maps song data
    search/route.ts     # Mock search endpoint with filtered results
    health/route.ts     # Health check

features/
  home/
    AlbumSection.tsx    # Section grid with skeleton loading
    AlbumCard.tsx       # Individual song card
    SongModal.tsx       # Detail modal for selected song
    albums.constants.ts # Search terms for home sections
    itunes.ts           # Client-side fetch helper

  player/
    PlayerContext.tsx    # Audio playback state (Context API)
    PlayerBar.tsx        # Fixed bottom player UI
    PlayerControls.tsx   # Play/pause, next, volume, auto-play
    PlayerProgress.tsx   # Seekable progress bar with time display
    usePlayer.ts         # Hook for consuming player context

  search/
    SearchProvider.tsx   # Search state with debounce and recent history
    SearchInput.tsx      # Search bar with recent searches chips
    SearchResults.tsx    # Results list with recommended fallback
    useSearch.ts         # Hook for consuming search context
    types.ts             # Song type and constants

  theme/
    ThemeProvider.tsx    # Dark/light mode with system detection
    ToggleSwitch.tsx    # Theme toggle button
    useTheme.ts         # Hook for consuming theme context
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm e2e:headless` | Run Playwright E2E tests |
| `pnpm e2e:ui` | Run Playwright in UI mode |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm analyze` | Analyze bundle size |

## API Routes

### `GET /api/songs?term=<query>&limit=<n>`

Proxies the iTunes Search API. Returns mapped song objects with 300x300 artwork and preview URLs. Validated with Zod.

### `GET /api/search?q=<query>`

Searches a mock song catalog by title or artist. Returns filtered results.

### `GET /api/health`

Health check endpoint.

## Architecture Decisions

- **React Context** for state management (player, search, theme) — no external state libraries
- **Server-side API proxy** — all iTunes API calls go through Next.js API routes, never directly from the client
- **Feature-based folder structure** — each feature is self-contained under `features/`
- **No database** — search uses mock data, home sections use iTunes API

## License

MIT
