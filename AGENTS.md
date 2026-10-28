# Repository Rules

Rules for all agents and contributors. Follow them on every change.

## Branching

- `main` holds the main code base. It must always be in a working state.
- Never commit directly to `main`, except the initial commit. Every new change goes in a new branch created from an up-to-date `main`.
- Branch names use `<type>/<short-kebab-description>`, e.g. `feature/user-login`, `fix/header-overflow`.
- Allowed branch types:
  - `feature/` new functionality
  - `fix/` bug fixes
  - `docs/` documentation only
  - `ci/` CI/CD and pipeline changes
  - `chore/` maintenance, tooling, dependencies
  - `refactor/` code changes with no behavior change
  - `test/` adding or fixing tests
  - `perf/` performance improvements
  - `style/` formatting only, no logic change
  - `build/` build system changes
- One concern per branch. Keep branches small and short-lived.
- Merge into `main` through a pull request, never by pushing directly.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) (semantic commits):

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Description: imperative mood, lowercase, no trailing period, max ~72 chars (e.g. `feat(auth): add login form`).
- Breaking changes: add `!` after the type/scope (`feat!: ...`) and/or a `BREAKING CHANGE:` footer.
- The commit type should match the branch type (`feature/` -> `feat`, `fix/` -> `fix`, etc.).
- Keep commits atomic: one logical change each, and the code builds and tests pass at every commit.

## Components

- Build components as pure as possible: output depends only on props (and local UI state). No data fetching, routing, or form-library coupling inside presentational components; pass values, errors and callbacks in as props.
- Keep side effects and state logic in custom hooks; compose them in routes (`src/routes/`) or container components.
- Every new component ships with a Storybook story (`Foo.stories.tsx`) covering its states (default, error, disabled, loading, etc.) and a test (`Foo.test.tsx`).
