---
name: commit-and-pr
description: Commit with a conventional commit message, push, and open a GitHub pull request against main with a short summary and a test plan
argument-hint: "[message hint]"
---

# Commit and Open a GitHub Pull Request

Commit the current changes, push, and open a PR into `main` if one does not already
exist. Rules come from [AGENTS.md](../../../AGENTS.md); if they disagree, AGENTS.md wins.

> **Never merge the PR.** Open it and stop.

## Steps

### 1. Analyze changes

Run in parallel:

```bash
git status
git diff --cached
git diff
git log --oneline -5
git branch --show-current
```

### 2. Test the feature

If the changes touch production code in `src/`, run the `test-feature` skill first and
follow it through to its report. Continue only if the verdict is **PASS**, or if the user
accepts the remaining items. Commit any tests it adds together with the feature. Skip
this step for changes that don't touch `src/` (docs, CI, config, skills).

### 3. Create a branch (if on `main`)

**Never commit to `main`.** If on `main`, branch from an up-to-date `main`:

```bash
git pull --ff-only origin main
git switch -c <type>/<short-kebab-description>
```

| branch prefix | commit type |
|---|---|
| `feature/` | `feat` |
| `fix/` `docs/` `ci/` `chore/` `refactor/` `test/` `perf/` `style/` `build/` | same name |

One concern per branch. If the changes mix unrelated work, split them across branches.

### 4. Stage and commit

Stage specific files by name; avoid `git add -A` / `git add .`. Never stage `.env`,
credentials, `node_modules/` or `dist/`.

Commit message ([Conventional Commits](https://www.conventionalcommits.org/)):

```
<type>(<optional scope>): <description>

<optional body: why, if not obvious>
```

- **Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`
- **Type matches the branch type** (table above)
- **Description:** imperative, lowercase, no trailing period, ≤ ~72 characters
- **Breaking change:** `!` after type/scope and/or a `BREAKING CHANGE:` footer
- **Atomic:** one logical change per commit
- End with the commit attribution trailer Claude Code is configured to add.

If the user passed an argument, use it as guidance for the message: $ARGUMENTS

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

Body explaining why.

Co-Authored-By: <as configured>
EOF
)"
```

### 5. Push

Not tracking → `git push -u origin <branch-name>`, otherwise `git push`.

### 6. Open the pull request

Check for an existing one first:

```bash
gh pr list --head "$(git branch --show-current)"
```

If none exists, create it with base `main`. If one exists, update its title/body if they
drifted: `gh pr edit <number> --title "..." --body "..."`.

**Title:** a valid Conventional Commit, same rules as the commit description. The repo is
squash-merge only with PR title as the commit title and PR body as the commit message, so
the title is what lands on `main`.

**Body:** two sections, nothing else.

1. **Summary:** short bullets covering the whole branch (not just the last commit). Group
   by what changed, one line each, no filler. Prefix anything callers must adapt to with
   **Breaking:**.
2. **Test plan:** a `- [ ]` checklist a reviewer can follow step by step: commands to run
   and what to see or click. Write concrete steps with expected results, not "verify it
   works".

Wrap file paths, function names and commands in backticks. End the body with the PR
attribution line Claude Code is configured to add.

```bash
gh pr create --base main \
  --title "<type>(<scope>): <description>" \
  --assignee @me \
  --body "$(cat <<'EOF'
## Summary
- Add a login form in `src/features/auth/LoginForm.tsx`.
- **Breaking:** `useSession()` returns `null` instead of `undefined` when signed out.

## Test plan
- [ ] `npm install && npm run dev`
- [ ] Open `http://localhost:5173/login`, submit empty form, expect inline errors
- [ ] Submit valid credentials, expect redirect to `/`
- [ ] Reload, expect session to persist

<attribution line as configured>
EOF
)"
```

### 7. Report

Tell the user the commit hash, the PR URL, and that the PR is open and unmerged.
