---
name: test-feature
description: Test the feature just implemented. Covers every defined use case and edge case, flags changes to old behavior for confirmation, and runs mutation testing on changed files to prove the tests catch regressions. Use when the user wants to verify a feature or check test quality.
argument-hint: "[path or scope hint, e.g. src/features/onboarding]"
---

# Test Feature

Prove the feature on this branch works and its tests are worth trusting. Optional scope: $ARGUMENTS

Stack: Vitest + jsdom, Testing Library, `user-event`, MSW (`src/test/server.ts`), setup in
`src/test/setup.ts`. Tests sit next to the source (`Foo.tsx` → `Foo.test.tsx`).

**Every test you write or review must follow the Testing rules in `AGENTS.md`** (query
priority, `userEvent.setup()`, behavior over markup, snapshots, MSW, helpers, hygiene).
Read them before step 2. When you review existing tests in scope, flag and fix any that break
those rules, even if they pass.

## 1. Scope

```bash
TARGET=$(gh pr view --json baseRefName -q .baseRefName 2>/dev/null || echo main)
git fetch origin "$TARGET" && BASE=$(git merge-base HEAD "origin/$TARGET")
git diff "$BASE"...HEAD --stat -- ${SCOPE:-src}
git diff "$BASE"...HEAD -- ${SCOPE:-src}
```

Include uncommitted work too (`git diff`). If `$ARGUMENTS` is a path, apply it as `SCOPE`
to every diff and find below.

## 2. Use cases and edge cases

List the use cases defined for this feature: the conversation, PR description, plan or
linked issue. If none are written down, derive them from the diff and confirm them with the
user. Add edge cases for each one: empty, null, boundaries, invalid input, loading, error and
network failure (MSW), double submit, keyboard and accessibility.

Map each item to a test and mark it **covered**, **partial** or **missing**. Write the
missing tests following the `AGENTS.md` Testing rules: one behavior per `it()`, `getByRole`
first, `userEvent.setup()`, MSW `server.use(...)` per test for network cases, and a named
snapshot only for decorative output.
Then run them:

```bash
npm test -- <changed test files>
```

### Stories

Every new or changed component under `src/components/` needs a Storybook story next to it
(`Foo.tsx` → `Foo.stories.tsx`), including every generated `src/components/ui/` component,
used or not. Check that each story covers the states and variants the app actually uses
(default, error, disabled, loading, empty, long content). For `ui/` components, a default
story is enough until the app uses more variants. Write the missing stories with typed
`Meta`/`StoryObj` and `args`, then verify they build:

```bash
npm run build-storybook
```

Mark each component **has stories**, **partial** or **missing**. Components should be pure
(props in, UI out) so stories need no providers or mocks; flag any that do.

## 3. Old behavior changes

Classify every diff hunk as **ADDED**, **CHANGED**, **REMOVED** or **REFACTOR**. For each
CHANGED or REMOVED item, read the current assertions. A test-file diff is not proof, and
neither is a deleted or weakened test. Run the full suite (`npm test`) and treat any
pre-existing test that now fails as a behavior change.

Show a table (file, old → new, test that covers it) and ask: **"Are these changes
intentional?"** Wait for an answer. Then update the tests, or revert the change.

## 4. Mutation testing

Targets: changed, non-deleted production files in `src/` (exclude `*.test.*`, `src/test/`,
`*.d.ts`, and unmodified `src/components/ui/` files; include the parts of `ui/` files we changed). No targets → skip this step.

Install only the Stryker packages that are missing, and note which ones you added:

```bash
npm ls @stryker-mutator/core @stryker-mutator/vitest-runner
npm i -D @stryker-mutator/core @stryker-mutator/vitest-runner
```

Write `<scratchpad>/stryker.conf.json` and run it:

```json
{
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner"],
  "vitest": { "configFile": "vite.config.ts", "related": true },
  "mutate": ["src/features/x/Foo.tsx"],
  "reporters": ["clear-text", "json"],
  "jsonReporter": { "fileName": "<scratchpad>/stryker-report.json" },
  "thresholds": { "high": 80, "low": 60, "break": null },
  "concurrency": 2
}
```

```bash
npx stryker run <scratchpad>/stryker.conf.json
```

For each surviving mutant, decide whether it is **actionable** (a real gap) or
**acceptable** (copy, class names, logging, equivalent mutant). Write tests that kill the
actionable ones and run Stryker again. Abort after 10 minutes and report partial results.

**Cleanup (always run, even on failure):** delete the scratchpad config and report, and
uninstall only the packages this run added, unless the user wants to keep them.
`package.json` and `package-lock.json` must end up as they were before this step.

## 5. Report

```markdown
## Test Feature Report — base `$TARGET`
- Use cases: X defined, Y edge cases, all covered / gaps: …
- Stories: X components, all have stories covering their states / gaps: …
- Testing rules: all tests in scope follow `AGENTS.md` / violations fixed: …
- Coverage: X% statements, Y% branches (threshold 80%)
- Behavior changes: X changed/removed, all confirmed / pending: …
- Mutation score: X% (killed/total), N actionable survivors left
- Verdict: PASS / NEEDS WORK, then the remaining items
```

Finish with `npm run typecheck && npm run lint && npm run test:coverage && npm run build-storybook` all green. Never commit; leave
that to `/commit-and-pr`.
