# Onboarding Form

The Venn front-end take-home task: a form where users enter their personal and business details (name, Canadian phone number, corporation number). It validates each field on blur, checks the corporation number against the API, and sends the profile to the API on submit.

**Live:** https://andre-venn-challenge.pages.dev

Built with React 19, TypeScript, Vite, react-hook-form, zod, TanStack Query and Tailwind with shadcn components.

## Quick start

Needs Node 22 (see `.nvmrc`).

```bash
nvm use
npm ci
npm run dev        # http://localhost:5173
```

The app talks to the QA API (`https://fe-hometask-api.qa.vault.tryvault.com`). Its base URL comes from `VITE_API_BASE_URL` in `.env.development`, `.env.production` and `.env.test`.

## Scripts

| Script                         | What it does                                                      |
| ------------------------------ | ----------------------------------------------------------------- |
| `npm run dev`                  | Start the dev server                                              |
| `npm run build`                | Typecheck and build for production into `dist/`                   |
| `npm run preview`              | Serve the production build                                        |
| `npm test`                     | Run all tests once (`npm run test:watch` to watch)                |
| `npm run test:coverage`        | Run tests with coverage; fails under 80%                          |
| `npm run lint`                 | ESLint, type-aware                                                |
| `npm run typecheck`            | TypeScript only                                                   |
| `npm run format`               | Format everything with Prettier (`format:check` to only check)    |
| `npm run storybook`            | Component explorer on http://localhost:6006                       |
| `npm run build-storybook`      | Static Storybook build                                            |
| `npm run semantic-release:dry` | Show which version the commits since the last tag would release   |
| `npm run deploy:pages`         | Upload `dist/` to Cloudflare Pages (the release workflow runs it) |

## Deploy

Live at https://andre-venn-challenge.pages.dev (Cloudflare Pages, account "andre").

Committing or merging to `main` deploys nothing. The app goes live only when the **create-release** workflow runs:

```bash
gh workflow run create-release.yml                  # release
gh workflow run create-release.yml -f dry_run=true  # say which version would ship, change nothing
```

It checks that the last CI run on `main` passed, then semantic-release takes over (`.releaserc.js`): it works out the version from the commits since the last tag, tests and builds the app, tags `vX.Y.Z`, uploads `dist/` to Cloudflare Pages with `wrangler pages deploy`, publishes the GitHub release notes and commits the `package.json` bump back as `chore(release): X.Y.Z [skip ci]`.

`feat` → minor, `fix` / `perf` / `refactor` → patch, `!` → major; `docs`, `chore`, `ci`, `test`, `style` alone release nothing. A squash merge keeps only the PR title, so the title decides.

One-time setup, in the repo settings:

- Secrets `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit) and `CLOUDFLARE_ACCOUNT_ID`
- Optional variables `CF_PAGES_PROJECT` (defaults to `andre-venn-challenge`) and `SITE_URL`

To put an existing tag back on the site without a new release, a rollback for instance, run the **deploy** workflow: `gh workflow run deploy.yml -f tag=v1.0.1`.

Don't connect the repo through Cloudflare's Git integration: that would deploy every push to `main`.

## Features

- **First and last name:** required, at most 50 characters.
- **Phone number:** required, Canadian only, in `+1XXXXXXXXXX` form with no spaces or symbols other than the leading `+`. Validated with `libphonenumber-js`, so numbers with unassigned or US area codes are rejected too.
- **Corporation number:** required, 9 digits, then checked with `GET /corporation-number/:number`. The input shows a spinner while checking, then a check mark or a cross.
- **Validation on blur**, including the remote check. Errors show under each field and are linked to their input for screen readers.
- **Submit** validates every field (reusing a cached corporation number check), then sends `POST /profile-details`. A 400 about one field (e.g. "Invalid phone number") shows under that field and focuses it; any other 400 shows the API's message below the button, and other failures show a generic retry message. On success the button is replaced by a "saved" message, which takes focus and is announced.

## Project structure

```
src/
  api/                    server communication
    corporation-number/   request, query, types, MSW mock handlers
    profile-details/      request, mutation, types, MSW mock handlers
    api-url.ts            typed URL builder for paths like "/x/:id"
    api-error.ts          error carrying the HTTP status and API message
  components/
    onboarding-form/      the form, its hook, schema, tests and stories
    form-field/           label + input + error, used for every field
    step-indicator/       "Step 1 of 5"
    ui/                   shadcn components
  layouts/                route wrappers shared by many pages (default layout)
  pages/                  route components, wired up in router.tsx
  utils/validation/       reusable zod field validators
  test/                   test setup, render helpers, factories, MSW server
```

Each feature keeps its code, tests and stories in one folder. `AGENTS.md` has the full conventions.

## How it fits together

- **Pure components, logic in hooks.** `OnboardingForm` only renders props, so it works in Storybook and tests without providers. `useOnboardingForm` holds the form logic (react-hook-form + zod, blur validation, submit state). `OnboardingPage` connects the two and passes in the API mutation.
- **Validators are reusable.** Each rule lives in `src/utils/validation/` (`personName`, `canadianPhone`, `corporationNumber`, all built on `requiredText`) and takes the field label, so messages read naturally. The form schema just combines them.
- **The remote check is part of the schema.** `corporationNumber` takes an optional async check. The hook passes one that goes through the TanStack Query cache, so blurring the same number twice, or submitting after a blur, makes one request.
- **One source of truth per endpoint.** Each endpoint exports its path (`"/corporation-number/:number"`). Both the request and its MSW mock use it, and each mock is typed with the response type, so they cannot drift apart.
- **Limits are enforced by messages, not `maxLength`.** A hard limit silently drops pasted characters and tells assistive tech nothing.

## Testing

- **Integration tests** with Vitest, React Testing Library and user-event. They render the page through the real router and providers and use it like a user would: type, tab away, submit, then check what is shown.
- **Network mocked with MSW** at the HTTP level, never by stubbing `fetch`. Tests cover success, API validation errors, server errors and network failures. Any unmocked request fails the test.
- **Validators** have their own edge-case tests (boundaries, special characters, non-Canadian numbers).
- **Tests fail on any `console.error` or `console.warn`**, so React warnings cannot slip through.
- **Coverage** must stay at or above 80% (it is currently 100%). Tests run with the React Compiler on, as in production.
- **Storybook** shows each component's states (empty, errors, checking, verified, submitting, submitted), exposes their props as controls and runs accessibility checks.

## Quality gates

- **CI** (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`: format check, lint, typecheck, tests, coverage, build and Storybook build.
- **Pre-commit** (husky + lint-staged) formats, lints and typechecks staged files. **commitlint** enforces Conventional Commits.
- **ESLint** includes jsx-a11y, Testing Library and Vitest rules, and fails on deprecated APIs.
- **Bundle size:** `libphonenumber-js` loads on the first phone check, and React gets its own long-cached chunk. That keeps every chunk under Vite's 500 kB warning (initial JS about 165 kB gzip).

## Trade-offs and next steps

- **No phone formatting as you type.** The brief asks for `+1` and digits only, so the input takes the number exactly as typed and explains what is wrong, rather than reformatting it.
- **The status icon updates on blur.** After you edit a checked corporation number, the old icon stays until the field is blurred again, since validation runs on blur.
- **The form stays editable after saving.** The next step in a real flow would be navigating to step 2.
- **A 500 from the corporation number check** shows the generic "could not be verified" message rather than the server's message.
