# PlayNext

A minimal music preview web app built with Next.js 15 and the iTunes Search API.

## What it does

PlayNext lets you browse curated song sections, search for music, and play 30-second iTunes previews — all in a clean, responsive interface with dark mode support.

### Features

- **Home Sections** — Three curated sections on load: Selected For You, Top Hits Global, and Top Hits India (powered by iTunes Search API)
- **Song Cards** — Album artwork, title, and artist displayed in a responsive grid (2/3/6 columns) with skeleton loading
- **Song Modal** — Click any card to see a detail modal with Play and Close actions
- **Audio Player** — Fixed bottom bar with play/pause, next, volume slider, progress bar with seek, and auto-play toggle with queue looping
- **Search** — Debounced iTunes search with recent search history (persisted in localStorage) and recommended songs fallback
- **Dark Mode** — System-detected theme with manual toggle, persisted preference, no hydration flicker
- **Keyboard Controls** — Spacebar toggles play/pause, Escape closes modals

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for API validation
- [Radix UI](https://www.radix-ui.com/) primitives
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)
- [ESLint 9](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Semantic Release](https://semantic-release.gitbook.io/) for automated versioning and changelog

## Project Structure

```
app/
  page.tsx              # Home page (client component)
  layout.tsx            # Root layout with providers
  api/
    songs/route.ts      # iTunes proxy — fetches and maps song data
    search/route.ts     # iTunes search endpoint with Zod validation
    health/route.ts     # Health check

features/
  home/
    AlbumSection.tsx    # Section grid with skeleton loading
    AlbumCard.tsx       # Individual song card
    SongModal.tsx       # Detail modal for selected song
    albums.constants.ts # Search terms and country codes for home sections
    itunes.ts           # Client-side fetch helper

  player/
    PlayerContext.tsx    # Audio playback state (Context API)
    PlayerBar.tsx       # Fixed bottom player UI
    PlayerControls.tsx  # Play/pause, next, volume, auto-play
    PlayerProgress.tsx  # Seekable progress bar with time display
    usePlayer.ts        # Hook for consuming player context

  search/
    SearchProvider.tsx  # Search state with debounce and recent history
    SearchInput.tsx     # Search bar with recent searches chips
    SearchResults.tsx   # Results list with recommended fallback
    useSearch.ts        # Hook for consuming search context
    types.ts            # Song type and constants

  theme/
    ThemeProvider.tsx   # Dark/light mode with system detection
    ToggleSwitch.tsx    # Theme toggle button
    useTheme.ts        # Hook for consuming theme context

components/
  Button/             # Reusable button with Storybook stories and tests
  Tooltip/            # Tooltip component
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

### `GET /api/songs?term=<query>&limit=<n>&country=<code>`

Proxies the iTunes Search API. Returns mapped song objects with 300×300 artwork and preview URLs. Supports optional country code for regional results. Validated with Zod.

### `GET /api/search?q=<query>`

Searches iTunes for music by query string. Returns up to 10 results with artwork, preview URLs, and duration. Validated with Zod.

### `GET /api/health`

Health check endpoint. Also available at `/healthz`, `/health`, and `/ping`.

## Architecture Decisions

- **React Context** for state management (player, search, theme) — no external state libraries
- **Server-side API proxy** — all iTunes API calls go through Next.js API routes, never directly from the client
- **Feature-based folder structure** — each feature is self-contained under `features/`
- **Conventional Commits** — commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) spec to drive Semantic Release

## CI/CD

GitHub Actions workflows handle:

- **check.yml** — Lint, format, unit tests, and Storybook tests on every push
- **playwright.yml** — E2E tests across Chromium, Firefox, and WebKit
- **nextjs_bundle_analysis.yml** — Bundle size tracking

Releases are automated via Semantic Release from `main`.

## License

MIT
