# GIT-OS — Git Workflow Standards

## Branching

- **Never commit directly to `main`** — all changes via PR
- Branch naming: `feat/<name>`, `fix/<name>`, `chore/<name>`, `test/<name>`, `hotfix/<name>`
- One feature per branch
- Stacked branches allowed when features depend on each other

## Commits

- **Conventional Commits** format: `type(scope): Description`
- Allowed types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `chore`
- Imperative mood, lowercase type, capitalized description
- No periods, under ~50 chars subject
- One logical change per commit (atomic)
- No emojis in commits

## Pull Requests

- Max 5-6 files per PR
- PRs require review before merge to `main`
- Merge PRs in order when using stacked branches

### PR Description Template

```
### Ticket Link
---------------------------------------------------

### Related Links
---------------------------------------------------

### Description
---------------------------------------------------

### Steps to Reproduce / Test
---------------------------------------------------

### GIF's
---------------------------------------------------
```

## Automation

- GitHub Actions CI/CD
- Semantic Release for versioning
- Changelog auto-generation
- Commits drive all automation
