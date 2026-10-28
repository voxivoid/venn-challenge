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
- Keep side effects and state logic in custom hooks; compose them in pages (`src/pages/`, wired up in `src/router.tsx`) or container components.
- Every new component ships with a Storybook story (`Foo.stories.tsx`) covering its states (default, error, disabled, loading, etc.) and a test (`Foo.test.tsx`).
- Generated shadcn components in `src/components/ui/`:
  - **Stories:** every component gets one, used or not, so we can see how it looks. Cover its default look plus the variants the app actually uses; add other variants when the app starts using them.
  - **Tests:** not needed for unmodified components; the integration tests of the components that use them cover them. When we modify a `ui/` component (e.g. `Button` `loading`), test what we changed.

## Testing

Every agent and contributor follows these rules when writing or changing tests. `npm run lint` enforces part of them (`eslint-plugin-testing-library`, `@vitest/eslint-plugin`); the rest is on review.

### Stack and layout

- Vitest + jsdom, Testing Library, `@testing-library/user-event`, MSW. Global setup lives in `src/test/setup.ts`, shared helpers in `src/test/`.
- Tests sit next to the source: `Foo.tsx` → `Foo.test.tsx`. Snapshots go in the colocated `__snapshots__/`.
- Write integration-style tests: render the component (or route) the way a user meets it and assert what they see. Do not test hooks or internals in isolation unless they hold logic no component exposes.

### Queries

Use the Testing Library priority order, highest first. Drop down only when the one above cannot express the query, and say why in a comment.

1. `getByRole(role, { name })`: what assistive tech sees. Default choice for buttons, headings, textboxes, alerts, etc.
2. `getByLabelText`: only for form controls with no fitting role.
3. `getByPlaceholderText`, `getByText`, `getByDisplayValue`
4. `getByAltText`, `getByTitle`
5. `getByTestId`: last resort, for elements with no accessible semantics. Prefer putting the test id on test-owned elements, not in production code.

- `getBy*` when the element must exist, `queryBy*` only to assert absence, `findBy*` for anything async (API results, debounced validation).
- No direct DOM access (`container.querySelector`, `.children`, `.firstChild`). Use `screen` and `within`.
- Assert accessibility state with jest-dom: `toBeInvalid`, `toBeDisabled`, `toHaveAccessibleDescription`, `toHaveAccessibleErrorMessage`, `toHaveFocus`.

### Interactions

- Create one session per test with `const user = userEvent.setup()` before rendering. Never use `fireEvent` when `user-event` can do it.
- Cover keyboard paths (tab order, Enter to submit) alongside clicks.

### Assertions

- Assert behavior, not implementation: visible text, roles, ARIA state, values, calls to callbacks passed as props. No assertions on CSS classes or component state.
- One behavior per `it()`, named after what the user observes.

### Snapshots

- Use snapshots only for small, presentational output where markup *is* the contract, such as decorative elements with no accessible semantics (spinners, icon placement). Never snapshot whole pages or forms.
- Name each snapshot (`toMatchSnapshot('loading')`). Snapshot alongside behavioral assertions, never instead of them.
- Review every snapshot diff. Never run `vitest -u` blindly; an unexpected diff is a bug until proven otherwise.

### Network

- Mock HTTP with MSW only, never by stubbing `fetch`. Register handlers per test with `server.use(...)`, covering success, validation error (4xx), server error and network failure.
- Unhandled requests fail the test (`onUnhandledFrame: 'error'`); add a handler rather than loosening this.

### Helpers and data

- Render through the app providers with helpers from `src/test/render.tsx`: `renderWithProviders(ui)` for components that need providers (TanStack Query), `renderRoute(path)` for pages through the real router. Both return `user` and a fresh `queryClient`.
- Build test data with factories in `src/test/` (e.g. `buildProfile({ phone: '…' })`) once a shape is used by more than one test. No copy-pasted fixtures.

### Hygiene

- Tests fail on any `console.error` or `console.warn` (React act and key warnings included). Fix the cause; do not mock the console away in a test.
- Mocks are restored after each test (`vi.restoreAllMocks`). Do not leak state between tests.
- No `it.only`, `describe.only`, `it.skip` or `xit` in commits.

### Coverage

- `npm run test:coverage` enforces 80% statements, branches, functions and lines over `src/`, excluding generated `ui/`, stories, tests and wiring files.
- Coverage is a floor that flags blind spots, not the goal. Do not write tests just to move the number.
- `npm test` runs with the React Compiler on, like production. Only `test:coverage` turns it off (`COVERAGE=1`), because the compiler's memo branches would skew branch coverage. Never disable the compiler for regular test runs.
- Tests do not run on pre-commit (it only lints and typechecks staged files). Run them locally before pushing; CI will run them.
