# Git OS --- Automation-First Workflow

*For Conventional Commits + Semantic Release + GitHub Actions*

------------------------------------------------------------------------

## Mission

My Git history powers automation.

Commits drive:

-   Version bumps
-   Changelogs
-   Release notes
-   Deployments
-   CI behavior

If commits are wrong → automation breaks.
If automation breaks → discipline failed.

------------------------------------------------------------------------

# 1. Branching Model

## `main`

-   Production branch
-   Always stable
-   Releases happen from here
-   **Never commit directly**
-   All changes enter via PR (requires review before merge)

## `feature/<name>`, `feat/<name>`

-   Branch from `main` (or from the previous feature branch if stacking)
-   PR back into `main`
-   One feature per branch
-   Max 5–6 files per PR

## `fix/<name>`

-   Branch from `main`
-   PR back into `main`
-   Bug fixes and corrections

## `chore/<name>`

-   Branch from `main`
-   PR back into `main`
-   Tooling, config, and cleanup

## `test/<name>`

-   Branch from `main`
-   PR back into `main`
-   Test additions or updates

## `hotfix/<name>`

-   Branch from `main`
-   PR back into `main`
-   Urgent production fixes

**Core rule:**\
Branches are temporary.
History is permanent.
Always branch from the latest `main` (or the tip of the previous feature when stacking).

------------------------------------------------------------------------

# 1.1. Workflow

## Standard Flow (single feature)

1.  Pull latest `main`
2.  Create feature branch: `git checkout -b feat/<name>`
3.  Make atomic commits following Conventional Commits
4.  Push branch, open PR → `main`
5.  Review, approve, merge

## Stacked Flow (sequential features)

When features depend on each other and PRs await review:

1.  `feat/a` branches from `main` → PR to `main`
2.  `feat/b` branches from `feat/a` → PR to `main`
3.  `feat/c` branches from `feat/b` → PR to `main`
4.  Merge PRs **in order** (a → b → c)

Each PR to `main` shows the cumulative diff. Merge in sequence
so `main` advances one feature at a time.

## Rules

-   **Always branch from the latest available base** (`main` or previous feature tip)
-   **One feature per branch** — keep PRs focused
-   **No direct commits to `main`** — all changes go through PR
-   **PRs require review** before merging to `main`

------------------------------------------------------------------------

# 2. Commit Format (Strict)

We follow **Conventional Commits** exactly.

type(scope?): description

(optional body)

(optional footer)

------------------------------------------------------------------------

# 3. Allowed Types (Automation Safe)

Only use:

-   `feat:` → new feature
-   `fix:` → bug fix
-   `refactor:` → internal code change
-   `perf:` → performance improvement
-   `docs:` → documentation
-   `style:` → formatting only
-   `test:` → tests
-   `chore:` → tooling/config

Rules:

-   Do NOT invent types
-   Do NOT skip colon
-   Do NOT capitalize the type
-   Do NOT add emojis

Correct:

feat: Add login validation
fix(auth): Prevent token crash

Wrong:

Feature: login
added login
feat(login)
feat - login

------------------------------------------------------------------------

# 4. Subject Line Rules

-   Imperative mood
-   Clear and specific
-   No period
-   Under \~50 characters
-   Lowercase type, capitalized description

Example:

feat: Add password reset flow

------------------------------------------------------------------------

# 5. Body Rules (When Needed)

Use body when:

-   Logic is complex
-   Context matters
-   Behavior changes
-   Explaining WHY

Rules:

-   Blank line after subject
-   Wrap at ~72 characters
-   Explain WHY first
-   Then WHAT changed
-   Avoid unnecessary detail

Example:

fix: Prevent crash when token expires

The API returned undefined when session expired.
Add guard clause to avoid null access.

------------------------------------------------------------------------

# 6. Breaking Changes

If backward compatibility changes:

BREAKING CHANGE: explanation

Example:

refactor: Remove legacy user endpoint

BREAKING CHANGE: /v1/users removed. Use /v2/users

------------------------------------------------------------------------

# 7. Automation Awareness

Every commit triggers:

-   GitHub Actions CI
-   Linting
-   Tests
-   Semantic version calculation
-   Changelog generation
-   Possible deployment

Each commit must be:

-   Intentional
-   Atomic
-   Correctly typed
-   Meaningful

Do not commit noise.

------------------------------------------------------------------------

# 8. Atomic Commit Rule

One logical change per commit.

Good:

feat: Add login endpoint
test: Add login integration tests

Bad:

feat: Add login and fix navbar and update readme

Atomic commits make:

-   Releases predictable
-   Reverts safe
-   Changelog clean

------------------------------------------------------------------------

# 9. Vibe Coding Mode Checklist

Before commit:

1.  Is the type correct?
2.  Does it match what changed?
3.  Is this one logical change?
4.  Will Semantic Release understand it?
5.  Should this be split into multiple commits?

If unsure → split it.

------------------------------------------------------------------------

# 10. What Not To Do

Never:

-   Commit without a type
-   Use random prefixes
-   Bundle multiple concerns
-   Push broken tests
-   Force push main
-   Rewrite shared history

Automation depends on consistency.

------------------------------------------------------------------------

# 11. Clean History Principle

Your Git log should read like:

feat: Add OAuth login
fix(auth): Prevent refresh token race condition
refactor(api): Simplify user validation
test: Add coverage for login edge cases

If it looks messy → clean before pushing.

Git is communication.
Automation is the reader.

------------------------------------------------------------------------

# Final Rule

Commits are not notes.
Commits are instructions to automation.

Type correctly.
Structure correctly.
Keep them atomic.
Let CI + Semantic Release do the rest.

------------------------------------------------------------------------

End of Git OS
