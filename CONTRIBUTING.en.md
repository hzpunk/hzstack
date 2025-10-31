# Contributing (HZ Base)

## Creating issues
- Feature: use `docs/templates/issue_feature.md`
- Bug: use `docs/templates/issue_bug.md`

## Branches and commits
- Branches: `feature/<scope>-<short-title>`, `fix/<scope>-<short-title>`
- Commits: Conventional Commits (e.g., `feat(auth): add jwt rotation`)

## Pull Requests
- Use the template `docs/templates/pr.md`
- Requirements before merge:
  - All checks green (lint, tests, build)
  - Updated docs when behavior changes
  - ADR for architectural changes

## Testing
- Levels: unit (required), integration (as needed), e2e (as needed)
- Minimum coverage — defined by the project

## Releases
- SemVer
- Changelog required
