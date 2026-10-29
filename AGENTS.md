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
- Start every piece of work on a single branch. Keep branches small and short-lived, ideally one concern each.
- Splitting is the user's call. When the changes cover more than one concern or context (e.g. a refactor mixed with a feature, tooling next to app code, docs beside code, an unrelated fix found along the way, or a diff too large to review in one sitting), suggest splitting into separate branches and PRs, say how you would cut it, then wait for the user's decision. Never split or merge branches on your own.
- Merge into `main` through a pull request, never by pushing directly.
- Agents open a pull request only when the user asks for one (e.g. by running `/commit-and-pr` or saying "open a PR"). Committing and pushing a branch does not imply opening a PR; stop after the push and ask. Never merge a PR.

## CI

- GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`: format check, lint, typecheck, tests, coverage, app build and Storybook build. Every step must pass before a PR is merged.
- When adding a check that matters for every change, add it as a step there instead of relying on contributors to run it locally.

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

## Formatting

- Prettier formats everything (Prettier defaults, no config file: double quotes, semicolons). Run `npm run format`; CI-style check is `npm run format:check`. The pre-commit hook formats staged files, so never hand-format or reformat unrelated files.
- Generated code (e.g. shadcn components) is formatted like the rest; do not add it to `.prettierignore`. That file only lists build output and the lockfile.

## Dependencies

- Before adding a runtime dependency (`npm i <pkg>`), check its cost: look it up on bundlephobia or read its docs, and prefer a smaller or tree-shakeable alternative when one does the job.
- After adding it, measure the impact: run `npm run build` before and after and compare the `dist/assets/*.js` sizes (gzip column). A jump of more than ~10 kB gzipped needs a reason.
- If the increase is large, reduce it: import only what you use (subpath imports), lazy-load it (`React.lazy` or dynamic `import()`), or pick a lighter package.
- Put the before/after size in the PR summary (e.g. "+8 kB gzip for `zod`"). The build already warns above 500 kB per chunk; never ignore that warning.
- Dev-only dependencies (`npm i -D`) are exempt.
- Never use APIs marked `@deprecated`; use the replacement their note names. `npm run lint` fails on them (`@typescript-eslint/no-deprecated`, which needs type-aware linting).

## Components

- Build components as pure as possible: output depends only on props (and local UI state). No data fetching, routing, or form-library coupling inside presentational components; pass values, errors and callbacks in as props.
- Keep side effects and state logic in custom hooks; compose them in pages (`src/pages/`, wired up in `src/router.tsx`) or container components.
- Colocate by feature: a component's hook, schema, tests and stories live in its folder (`src/components/onboarding-form/use-onboarding-form.ts`). The component file itself stays pure; its hook is a separate file wired up by the page.
- `src/hooks/` is only for generic hooks used by two or more features (e.g. `useDebounce`). Move a feature hook there only once a second feature needs it.
- Every new component ships with a Storybook story (`Foo.stories.tsx`) covering its states (default, error, disabled, loading, etc.) and a test (`Foo.test.tsx`).
- Generated shadcn components in `src/components/ui/`:
  - **Stories:** every component gets one, used or not, so we can see how it looks. Cover its default look plus the variants the app actually uses; add other variants when the app starts using them.
  - **Tests:** not needed for unmodified components; the integration tests of the components that use them cover them. When we modify a `ui/` component (e.g. `Button` `loading`), test what we changed.

## API

- Server communication lives in `src/api/`: the TanStack Query client (`query-client.ts`) plus one folder per resource (`src/api/corporation-number/`) holding its request functions and query/mutation hooks (`corporation-number.ts`) and its MSW handlers for tests (`corporation-number.handlers.ts`), so mocks change with the API they fake. Components never call `fetch` directly.
- Each resource folder has an `index.ts` with its public surface; import from `@/api/<resource>`. The handlers file stays out of `index.ts` so MSW never reaches the app bundle.
- Each endpoint exports its path as a constant with `:param` placeholders (`CORPORATION_NUMBER_PATH = "/corporation-number/:number"`). Build URLs with `apiUrl(path, params)` from `src/api/api-url.ts`; the MSW handler uses the same constant, so request and mock cannot drift apart.
- Configuration comes from Vite env files (`.env.development`, `.env.production`, `.env.test` for Vitest), only `VITE_`-prefixed vars reach the client. Declare each var in `src/env.d.ts` and read it through `src/api/config.ts`, never `import.meta.env` directly. Never put secrets in these files: they are committed and shipped in the bundle.

## Utils and validation

- Shared, framework-agnostic helpers live in `src/utils/` (`cn.ts`, ...), one concern per file, each with a colocated test.

- Reusable field validators live in `src/utils/validation/` (one file per validator, exported from `src/utils/validation/index.ts`): e.g. `requiredText`, `personName`, `canadianPhone`, `corporationNumber`. They take the field label so messages read naturally, and build on `requiredText` instead of repeating the required/trim rules.
- Each form assembles its own schema next to the form component, from those validators: `src/components/<form>/<form>.schema.ts` exports the schema and its inferred types (`<Form>Values`, `<Form>Field`).
- Do not define field rules inline in a form schema; add or extend a validator in `src/utils/validation/` so other forms can reuse it.
- Test each validator's edge cases next to it (`person-name.test.ts`); test the assembled form schema only for wiring (labels, trimming, every field reported).
- Enforce limits through validation messages, not the `maxLength` attribute: a hard limit silently drops typed or pasted characters and tells assistive tech nothing. Keep limits private to the validator that owns them.

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

- Use snapshots only for small, presentational output where markup _is_ the contract, such as decorative elements with no accessible semantics (spinners, icon placement). Never snapshot whole pages or forms.
- Name each snapshot (`toMatchSnapshot('loading')`). Snapshot alongside behavioral assertions, never instead of them.
- Review every snapshot diff. Never run `vitest -u` blindly; an unexpected diff is a bug until proven otherwise.

### Network

- Mock HTTP with MSW only, never by stubbing `fetch`. Register handlers per test with `server.use(...)`, using the resource's handlers from `src/api/<resource>/<resource>.handlers.ts`. Build each one with `createMockHandler<ResponseType>` from `src/test/msw.ts` (a typed default reply, overridden per test with `reply`, `networkError` or `delay`), so a mock that no longer matches the API type fails typecheck. Cover success, validation error (4xx), server error and network failure.
- Unhandled requests fail the test (`onUnhandledFrame: 'error'`); add a handler rather than loosening this.

### Helpers and data

- Render through the app providers with helpers from `src/test/render.tsx`: `renderWithProviders(ui)` for components that need providers (TanStack Query), `renderRoute(path)` for pages through the real router (React Router memory router). Both return `user` and a fresh `queryClient`.
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
