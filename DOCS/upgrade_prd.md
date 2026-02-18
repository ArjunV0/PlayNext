# PlayNext Auth Upgrade PRD

## Overview

Add Supabase Authentication (Google SSO + Magic Link) to PlayNext. Auth is required — unauthenticated users redirect to `/login`.

## Why

- PlayNext currently has zero authentication
- User identity needed for personalization, data persistence, and access control
- Supabase provides managed auth with minimal backend code

## How

- **Supabase Auth** via `@supabase/ssr` for Next.js App Router integration
- **Google SSO** as primary sign-in method
- **Magic Link** (email OTP) as fallback
- **Middleware** for route protection and token refresh
- **AuthProvider** context for client-side session state

---

## Phases

### Phase 1: Foundation (Branch: `feat/auth-foundation`)

**Commits:**
1. `chore: Add supabase dependencies`
2. `feat(auth): Add environment variable validation for Supabase`
3. `feat(auth): Add Supabase client utilities`

**Steps:**
- Install `@supabase/supabase-js` and `@supabase/ssr`
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `env.mjs`
- Create `.env.local` with placeholder values
- Create `lib/supabase/client.ts` (browser client)
- Create `lib/supabase/server.ts` (server client with async cookies)

**Verification:** `pnpm build` compiles, env vars validate, both client files export `createClient`

### Phase 2: Auth Backend (Branch: `feat/auth-backend`)

**Commits:**
1. `feat(auth): Add OAuth callback route handler`
2. `feat(auth): Add middleware for token refresh and route protection`

**Steps:**
- Create `app/auth/callback/route.ts` — exchanges OAuth code for session
- Create `middleware.ts` — refreshes tokens, protects routes, uses `getUser()`

**Verification:** `pnpm build` compiles, unauthenticated `/` redirects to `/login`, `/api/health` accessible

### Phase 3: Auth State Management (Branch: `feat/auth-state`)

**Commits:**
1. `feat(auth): Add sign-in and sign-out server actions`
2. `feat(auth): Add auth context provider and hook`
3. `feat(auth): Integrate auth provider into root layout`

**Steps:**
- Create `features/auth/actions.ts` — signInWithGoogle, signInWithMagicLink, signOut
- Create `features/auth/AuthProvider.tsx` — context with initialSession, onAuthStateChange
- Create `features/auth/useAuth.ts` — consumer hook
- Create `features/auth/index.ts` — barrel exports
- Modify `app/layout.tsx` — async, fetch session, wrap with AuthProvider

**Verification:** `pnpm build` compiles, useAuth returns user/session, session persists across refreshes

### Phase 4: Login UI (Branch: `feat/auth-login-ui`)

**Commits:**
1. `feat(auth): Add login page with Google SSO and magic link UI`

**Steps:**
- Create `app/login/page.tsx` — metadata + centered layout
- Create `features/auth/LoginCard.tsx` — Google button, divider, magic link form, states

**Verification:** Login page renders, Google button redirects, magic link validates email, dark mode works

### Phase 5: User Menu (Branch: `feat/auth-user-menu`)

**Commits:**
1. `feat(auth): Add user menu with avatar and sign-out`

**Steps:**
- Create `features/auth/UserMenu.tsx` — Radix dropdown, avatar, email, sign-out
- Integrate into app header (page.tsx)

**Verification:** Avatar in header, dropdown shows email + sign out, sign out redirects to `/login`

---

## File Manifest

| New Files | Purpose |
|-----------|---------|
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client |
| `app/auth/callback/route.ts` | OAuth callback handler |
| `middleware.ts` | Token refresh + route protection |
| `features/auth/actions.ts` | Server actions (signIn, signOut) |
| `features/auth/AuthProvider.tsx` | Auth context provider |
| `features/auth/useAuth.ts` | Auth consumer hook |
| `features/auth/index.ts` | Barrel exports |
| `features/auth/LoginCard.tsx` | Login UI component |
| `features/auth/UserMenu.tsx` | User avatar dropdown |
| `app/login/page.tsx` | Login route |
| `.env.local` | Supabase credentials |

| Modified Files | Change |
|-----------------|--------|
| `env.mjs` | Add Supabase env vars |
| `app/layout.tsx` | Async + AuthProvider |
| `app/page.tsx` | Add UserMenu to header |

---

## Environment Variables

| Variable | Bucket | Validation |
|----------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | client | `z.string().url()` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | `z.string().min(1)` |

---

## Supabase Dashboard Setup (Manual)

1. Create project at supabase.com
2. Enable Google provider: Authentication > Providers > Google
3. Google Cloud Console: Create OAuth 2.0 credentials
4. Redirect URI: `https://<project>.supabase.co/auth/v1/callback`
5. Site URL: `http://localhost:3000`
6. Add `http://localhost:3000/auth/callback` to Redirect URLs
7. Copy URL and anon key to `.env.local`

---

## Code Quality Rules

- Max complexity 8, max 250 lines/file, 120 char/line
- PascalCase components, camelCase functions, UPPER_SNAKE_CASE constants
- Separate `import type` from value imports
- Import order: React > Next > UI libs > aliases > external > internal > relative
- No console logs, no magic numbers, no unused code

## Git Workflow

- Never commit to main directly — all changes via PR
- Stacked branches: foundation > backend > state > login-ui > user-menu
- Atomic commits, Conventional Commits format
- Max 5-6 files per PR
- PRs merged in order
