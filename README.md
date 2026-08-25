# branchdiff

**Visual git & file diff in your browser — with AI-supported code review & resolve, GitHub & Bitbucket sync, and persistent sessions. 100% local, no cloud, no telemetry.**

- [![website](https://img.shields.io/badge/website-branchdiff-blue.svg)](https://encryptioner.github.io/branchdiff-releases/)
- [![license](https://img.shields.io/npm/l/@encryptioner%2Fbranchdiff.svg)](https://github.com/Encryptioner/branchdiff-releases/blob/master/LICENSE.md)
- [![changelog](https://img.shields.io/badge/changelog-view-blue.svg)](https://encryptioner.github.io/branchdiff-releases/changelog.html)
- [![github](https://img.shields.io/badge/github-Encryptioner-181717?logo=github)](https://github.com/Encryptioner/branchdiff-releases)
- [![npm](https://img.shields.io/npm/v/@encryptioner%2Fbranchdiff.svg)](https://www.npmjs.com/package/@encryptioner/branchdiff)
- [![pypi](https://img.shields.io/pypi/v/branchdiff.svg)](https://pypi.org/project/branchdiff/)
- [![SupportKori](https://img.shields.io/badge/SupportKori-☕-FFDD00?style=flat-square)](https://www.supportkori.com/mirmursalinankur)

Open any git diff in a browser UI with inline comments, split/unified views, and syntax highlighting. Use Claude Code slash commands (`/branchdiff-review`, `/branchdiff-resolve`) or any AI via prompts to review and fix code. Push and pull review comments to GitHub and Bitbucket PRs. Everything runs on your machine.

**Features:** inline diff comments · AI review & resolve (Claude Code or any AI) · GitHub & Bitbucket PR sync (browser + CLI) · persistent sessions across commits · three diff modes (git, file, delta) · code tours · keyboard navigation · multiple repos simultaneously

---

**Jump to:**
- [Install](#install)
- [Common tasks](#common-tasks)
- [AI Review](#ai-review)
- [Usage Guide](#usage-guide)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Why branchdiff?](#why-branchdiff)
- [Features](#features)
- [Guideline](#guideline)
- [Changelog](#changelog)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

---

## Install

**Quick start (Node.js required):**
```bash
npm install -g @encryptioner/branchdiff
```

**Other options:**
- `pnpm add -g @encryptioner/branchdiff` (pnpm)
- `yarn global add @encryptioner/branchdiff` (yarn)
- `pip install branchdiff` (Python — no Node.js needed)
- `brew tap encryptioner/branchdiff https://github.com/encryptioner/branchdiff-releases && brew install branchdiff` (Homebrew)
- Standalone binaries from [GitHub Releases](https://github.com/encryptioner/branchdiff-releases/releases) (no Node.js needed)
- `npx @encryptioner/branchdiff main..feature` (one-time, no install)

Tab-completion installs automatically — restart your terminal after install.

Requires `git` on your PATH (any version, including older distro-default builds like Ubuntu 18.04/20.04's). Node.js 18+ is needed only for npm/pnpm/yarn installs (not required for standalone binaries). Runs on Linux, macOS, and Windows — `auto cron add`/`cron list`/`cron remove` are Unix-only (`cron`/`crond`-backed); everything else works identically on all three.

> See the [**full installation guide**](https://encryptioner.github.io/branchdiff-releases/guideline.html) for platform-specific instructions (Homebrew, Scoop, pip, apt, standalone binaries).

---

## Common tasks

| I want to… | Command |
|---|---|
| View all commands and flags | `branchdiff -h` |
| See my uncommitted changes | `branchdiff` |
| Compare with main | `branchdiff main` |
| Compare two branches | `branchdiff main feat` |
| View a GitHub PR | `branchdiff https://github.com/owner/repo/pull/123` |
| View a Bitbucket PR | `branchdiff https://bitbucket.org/workspace/repo/pull-requests/123` |
| Browse repo files | `branchdiff tree` |
| Review a PR without switching branches | `branchdiff <pr-url> --worktree` |
| Auto-review my open PRs | `branchdiff auto --tool claude` |
| Auto-review PRs across every repo | `branchdiff auto --repo-paths ~/work --tool claude` |
| Browse commit history | `branchdiff history` |
| Browse the repo at an old commit | `branchdiff show HEAD~5` |
| Browse branches & tags | `branchdiff branches` |
| Search code across the repo | `branchdiff search "TODO"` |
| View last commit | `branchdiff HEAD~1` |
| Compare branch vs parent | `branchdiff -p` |
| Compare branch vs 3rd commit back | `branchdiff -p 3` |
| Only unstaged changes | `branchdiff -p 0` |
| Check PR status | `branchdiff pr info [--json]` |
| Merge a PR | `branchdiff pr merge` |
| Push comments to PR | `branchdiff sync push` |
| AI agent reference | `branchdiff agent guide` |
| Dark mode / unified view | `branchdiff main --dark --unified` |
| See effective config + its source | `branchdiff config` |

Any ref works: branch name, commit SHA, tag, `HEAD~N`, `origin/<branch>`. Name a branch you have never checked out and branchdiff fetches it from the remote first, so a colleague's branch works the moment they push it.

---

## AI Review

Review and fix diffs with any AI assistant — no plugin, no MCP server, no special setup.

> **Comments persist across commits** when comparing named branches (`branchdiff main..feature`). Start a fresh review with the "New review" button in the toolbar, or `branchdiff main..feature --new`.

**Step 1 — start branchdiff** (leave it running):
```bash
branchdiff main feat          # compare two branches
branchdiff                    # review uncommitted changes
branchdiff HEAD~3             # review last 3 commits
```

**Step 2 — pick your AI:**

**Claude Code and opencode** — install skills once, then use slash commands:
```bash
branchdiff skill add                 # creates .claude/skills/branchdiff-{review,resolve}/SKILL.md
branchdiff skill add --target user   # ~/.claude/skills — every repo on this machine
```
opencode reads `.claude/skills` too, so one install covers both. Re-run after upgrading branchdiff to update the skills in place.

**Want branchdiff's skills through a standard plugin system instead?** [`branchdiff-releases`](https://github.com/Encryptioner/branchdiff-releases) ships the same two skills standalone — its plugin version always tracks this CLI's version.

```bash
# Run in a terminal — --sparse skips that repo's unrelated apt/ package pool
# (the in-chat /plugin marketplace add prompt doesn't support --sparse):
claude plugin marketplace add Encryptioner/branchdiff-releases --sparse .claude-plugin plugins
claude plugin install branchdiff-skills@branchdiff
```

```bash
# opencode, Codex CLI, Gemini CLI, or any other SKILL.md-reading agent (no Node.js needed):
curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- --agent opencode branchdiff-review
```

| Slash command | What it does |
|---|---|
| `/branchdiff-review` | AI reads the diff and posts inline comments |
| `/branchdiff-review main feature` | Review a specific branch comparison |
| `/branchdiff-resolve` | AI reads open comments and makes the code fixes |

**Any other AI** — copy-paste one of these prompts:

*Review:*
```
You are reviewing code using branchdiff agent commands (not any other tool).
Run `branchdiff review guide` first to load the full reference, then:

1. Check for prior review context (nth-time review):
   branchdiff agent list --status resolved --json
   branchdiff agent list --status dismissed --json
   - Do NOT re-raise resolved issues — the author already addressed them.
   - Only re-flag dismissed issues if new evidence contradicts the dismissal reason.
   - Acknowledge improvements when the author addressed prior feedback.

2. Run `branchdiff agent diff` to read the full diff.

3. For each changed file, read the ENTIRE file (not just diff hunks) for full context.
   Analyze: data flow (null/undefined?), state/lifecycle (resource cleanup?), contracts (callers updated?), boundaries (input validation?), edge cases.

4. Validate each finding before commenting — re-read surrounding code, grep for imports, read actual call sites.
   Flag: logic errors, security issues, race conditions, broken contracts, missing tests.
   Skip: style, linter-catchable issues, pre-existing problems in unchanged code.

5. Post comments (order: [must-fix] first, then [suggestion], then [question]):
   branchdiff agent comment --file <path> --line <n> --body "[tag] message"
   Tags: [must-fix] bugs/security/data-loss · [suggestion] improvements/missing tests · [question] unclear
   For multi-line: add --end-line <n>

   Tone: lead with the problem, not a judgment. "This returns undefined when X is empty" not "this is wrong".
   Use collaborative language ("Consider using X" not "You should"). Acknowledge good code.

6. General comment (optional): 3+ findings → summarize themes.
   branchdiff agent general-comment --body "<overall summary>"

7. Confirm: branchdiff agent list --status open
Start: branchdiff review guide
```

*Resolve:*
```
You are resolving open review comments using branchdiff agent commands.
Run `branchdiff review guide` first to load the full reference, then:

1. Run `branchdiff agent list --status open --json` to get open threads.

2. For each thread:
   - Skip general comments (filePath "__general__") — these are summaries, not actionable.
   - Skip threads where the last comment is an agent asking a question and the user hasn't responded.
   - Read the comment body to understand the requested change. Interpret intent:
     code suggestion → make the change; documentation suggestion → update docs; unclear → ask for clarification.
   - Read the ENTIRE source file around the commented lines for full context, then make the fix.
   - Resolve: branchdiff agent resolve <id> --summary "Fixed: <what you did>"
   - Or dismiss if the fix shouldn't apply: branchdiff agent dismiss <id> --reason "<why>"

3. Confirm: branchdiff agent list
Start: branchdiff review guide
```

**Or pipe to a CLI AI tool (no session needed):**
```bash
branchdiff review context | claude -p "review for security"
branchdiff review context --refs "main feature" | claude -p "review these changes"
branchdiff review run --exec "claude" --mode review
branchdiff review run --exec "claude" --fresh      # ignore existing comments, review independently
branchdiff review run --exec "claude" --worktree   # review in .worktrees/, your branch untouched
```

**Or let branchdiff watch your open PRs:**
```bash
branchdiff auto --tool claude                      # asks before reviewing each PR
branchdiff auto --tool claude --review --skip-author   # never review your own PRs
branchdiff auto --tool claude --max-files 200 --max-lines 4000   # leave the giant PRs to a human
branchdiff auto --watch 10 --tool opencode --review --notify
branchdiff auto --source 'feature/*' --dest main --tool claude --push
cd ~/work && branchdiff auto --tool claude         # every repo directly under ~/work
branchdiff auto --repo-paths ~/work/api,../web --tool claude
```

`auto` finds open PRs on GitHub and Bitbucket, reviews only the ones with new non-merge commits, and streams each session's URL as it goes. Point it at a parent directory (or list repos with `--repo-paths`) and it covers them all: one scan, one combined candidate list, and an end-of-pass report of what was reviewed and where to find it.

| Flag | Default | What it does |
|---|---|---|
| *(none)* | **asks** | lists every PR that needs review once, numbered — pick with `1,3`, a range like `1-5`, `a` for all, or `q` to quit |
| `--review` | off | review without asking |
| `--skip-author` | off | skip PRs you opened yourself (matched by the authenticated user — GitHub login / Bitbucket uuid), so auto never reviews your own PRs |
| `--max-files` / `--min-files` | any size | skip PRs changing more (or fewer) than `n` files — send the 900-file bump to a human, don't spend a pass on a typo fix |
| `--max-lines` / `--min-lines` | any size | same, on diff lines (additions + deletions). Measured against the PR base; a PR whose size can't be determined is reviewed |
| `--notify` | off | desktop toast on start / done / push / failure; carries a link to the PR when pushed (else the local session view), opening in your browser where the OS allows it |
| `--push` | off | the only way comments reach the remote PR |
| `--tool <name>` | — | `claude`, `opencode`, `codex`, `gemini`, `cursor`, `llm` |
| `--exec "<cmd>"` | — | any CLI that reads a prompt on stdin and prints review JSON |
| `--skill` | off | drive the built-in review skill directly (no install, nothing to import) instead of the JSON pipe |
| `--skill-name <name>` | — | drive a custom skill instead (must already be installed via `skill add`) |
| `--additional-skill <name>` | — | fold another installed skill's guidance into the same pass (repeatable) |
| `--prompt <text>` | — | extra instructions for this run |
| `--repo-paths <paths>` | this repo, else its child repos | repos to review — comma-separated, repeatable, absolute/relative/`~`; a non-repo directory expands to its direct child repos |
| `--repo-concurrency <n>` | 4 | how many repos are scanned at once (reviews still run one repo at a time) |
| `--keep-servers <n\|all>` | all in one repo; 4 across repos | how many session servers each cycle leaves alive afterwards |

**Reviewing two things at once?** Every review is tied to exactly one session, and branchdiff never guesses which. AI reviews are pinned automatically. For commands you type, add `--port <n>` or `--session <id>` when more than one session is live — branchdiff lists the candidates rather than picking for you:

```bash
branchdiff list                        # see every running session
branchdiff agent list --port 5391      # target one
export BRANCHDIFF_SESSION_ID=<id>      # or pin the whole shell
```

With a single session open, no flag is needed.

<details>
<summary><b>Full AI review guide — 8 workflows (security, test coverage, breaking changes, dependency audit...)</b></summary>

#### What do you want to do?

| I want to… | Go to |
|---|---|
| Have AI review the diff and post comments | [Review workflow](#workflow-1--ai-review) |
| Have AI fix the open comments | [Resolve workflow](#workflow-2--ai-resolve) |
| Create a guided code tour for onboarding | [Tour workflow](#workflow-3--ai-tour) |
| Get a PR summary / review summary | [Summary workflow](#workflow-4--ai-summary) |
| Run a focused security scan | [Security audit](#workflow-5--security-audit) |
| Find untested code paths | [Test coverage gaps](#workflow-6--test-coverage-gaps) |
| Check for breaking API / schema changes | [Breaking-change review](#workflow-7--breaking-change-review) |
| Review added/changed dependencies | [Dependency review](#workflow-8--dependency-review) |

##### Option A — Claude Code / opencode: install skills once

```bash
branchdiff skill add                 # creates .claude/skills/branchdiff-{review,resolve}/SKILL.md
branchdiff skill add --target user   # ~/.claude/skills — available in every repo
branchdiff skill add --dir <path>    # an exact directory, if you keep skills elsewhere
```

opencode reads `.claude/skills` as well, so the default install serves both tools. Re-running updates skills branchdiff generated and leaves anything you wrote yourself alone.

**Want branchdiff's skills through a standard plugin system instead?** [`branchdiff-releases`](https://github.com/Encryptioner/branchdiff-releases) distributes the same skills standalone — plugin version always matches this CLI's version.

```bash
# Run in a terminal — --sparse skips that repo's unrelated apt/ package pool
# (the in-chat /plugin marketplace add prompt doesn't support --sparse):
claude plugin marketplace add Encryptioner/branchdiff-releases --sparse .claude-plugin plugins
claude plugin install branchdiff-skills@branchdiff
```

```bash
# opencode, Codex CLI, Gemini CLI, or any other SKILL.md-reading agent (no Node.js needed):
curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- --agent opencode all
```

Then use slash commands — no prompt needed:
- `/branchdiff-review` — AI reads the diff, posts inline comments with severity tags
- `/branchdiff-review main feature` — review a specific branch comparison
- `/branchdiff-resolve` — AI reads open comments, fixes the code, resolves each thread

> Say `/branchdiff-review` not "review the diff" — without the slash command, your AI may pick a different review tool by mistake.

##### Option B — Any AI: copy-paste prompts

> The AI can run `branchdiff review guide` for review/resolve workflows, or `branchdiff agent guide` for the complete CLI reference covering all commands. The prompts below instruct the AI to start with `review guide`.

**To review:**
```
You are reviewing code using branchdiff agent commands (not any other tool).
Run `branchdiff review guide` first to load the full reference, then:
1. Run `branchdiff agent refresh` to pull latest PR comments, then `branchdiff agent diff` to read the full diff.
2. Post inline comments: branchdiff agent comment --file <path> --line <n> --body "[tag] message"
   Tags: [must-fix] bugs/security · [suggestion] improvements · [nit] style · [question] unclear
3. For multi-line: add --end-line <n>. Diff-wide: branchdiff agent general-comment --body "..."
4. Confirm: branchdiff agent list --status open
Start: branchdiff review guide
```

**To review a specific branch comparison** (no session needed):
```bash
branchdiff review context --refs "main feature" | your-ai-tool
```

**To resolve:**
```
You are resolving open review comments using branchdiff agent commands.
Run `branchdiff review guide` first to load the full reference, then:
1. Run `branchdiff agent list --status open --json` to get open threads.
2. For each thread (skip general comments and threads awaiting a user reply): locate the code by what the comment describes, not its line number, then fix it:
   branchdiff agent resolve <id> --summary "what you did"
   branchdiff agent dismiss <id> --reason "why not fixing"
   branchdiff agent reply <id> --body "answer"  (for questions)
Start: branchdiff review guide
```

##### Option C — One-shot pipe

```bash
branchdiff review context | your-ai-tool
branchdiff review context --refs "main feature" | your-ai-tool   # no session needed
branchdiff review run --exec "claude -p 'review for security'" --mode review
branchdiff review run --exec "llm -m gpt-4o" --mode resolve
```

##### Option D — Load full guide (humans and AI)

```bash
branchdiff review guide    # review/resolve workflows
branchdiff agent guide     # complete AI agent reference (all commands)
```

---

#### Agent command reference

```bash
branchdiff agent refresh [--allow-stale]                      # pull latest PR comments; refuses if local branch is behind PR head
branchdiff agent diff                                         # read the full diff
branchdiff agent file <path> --ref <ref>                      # read a file's full content AT a ref, not the working tree
branchdiff agent list --json                                  # all threads
branchdiff agent list --status open --json                    # only open threads
branchdiff agent comment \
  --file src/app.ts --line 42 \
  --body "[must-fix] Missing null check"                     # post inline comment
branchdiff agent comment \
  --file src/app.ts --line 42 --end-line 48 \
  --body "[suggestion] Extract this into a helper"           # multi-line range
branchdiff agent general-comment \
  --body "[suggestion] Overall: auth module needs attention" # diff-wide comment
branchdiff agent resolve <thread-id> --summary "Fixed"       # mark resolved
branchdiff agent dismiss <thread-id> --reason "By design"    # mark won't fix
branchdiff agent reply <thread-id> --body "Can you clarify?" # reply to thread
branchdiff agent delete-thread <thread-id>                   # delete thread + comments
branchdiff agent clear-threads                                # delete all threads (prompts to confirm)
branchdiff agent clear-threads --yes                          # skip confirmation
branchdiff agent edit-comment <id> --body "updated text"     # edit a comment
branchdiff agent delete-comment <id>                          # delete a single comment
```

**Notes:**
- `--file` is relative to repo root (`src/app.ts`, not `/Users/.../src/app.ts`)
- `--line` is 1-indexed. `--end-line` defaults to `--line` if omitted
- Thread IDs accept 8-char prefix: `abc123de` instead of the full UUID

##### Severity tags

| Tag | Meaning |
|---|---|
| `[must-fix]` | Bug, security issue, data loss — must be fixed before merge |
| `[suggestion]` | Improvement, not required |
| `[nit]` | Style, naming, cosmetic |
| `[question]` | Unclear behavior, needs clarification |

---

#### Workflow 1 — AI Review

```
You are reviewing a code diff using branchdiff.

1. Run `branchdiff agent diff` to read the full diff.
2. For each genuine issue, post a comment:
   branchdiff agent comment --file <path> --line <n> --body "[<tag>] <message>"
   Use [must-fix] for bugs/security, [suggestion] for improvements,
   [nit] for style, [question] for unclear behavior.
3. Be concrete: quote the problematic code or reference the exact line.
   Avoid generic advice — say which error, at which line, and what should change.
4. For multi-line issues add --end-line <n>.
   For diff-wide comments use `branchdiff agent general-comment`.
5. After posting, run `branchdiff agent list --status open` to confirm comments are clear.

Start: branchdiff agent diff
```

#### Workflow 2 — AI Resolve

```
You are resolving open review comments using branchdiff.

1. Run `branchdiff agent list --status open --json` to get open threads.
2. For each thread:
   - [must-fix] or [suggestion]: apply the fix, then resolve:
     branchdiff agent resolve <id> --summary "<what you did>"
   - [question]: answer with a reply instead:
     branchdiff agent reply <id> --body "<answer>"
   - Disagree: dismiss with a reason (don't silently skip):
     branchdiff agent dismiss <id> --reason "<why>"
   - [nit]: skip unless it's a one-line change
3. After all threads, run `branchdiff agent list --json` and report:
   how many resolved, replied, dismissed.

Start: branchdiff agent list --status open --json
```

#### Workflow 3 — AI Tour

```
You are creating a guided code tour using branchdiff.

Topic: <e.g. "How authentication works">

1. Start the tour:
   branchdiff agent tour-start --topic "<topic>" --body "<one-paragraph overview>" --json
   Record the returned tour id.
2. Add 5–12 steps in logical order:
   branchdiff agent tour-step --tour <id> \
     --file <path> --line <n> [--end-line <n>] \
     --body "<explain WHY this code exists, edge cases, related steps>" \
     --annotation "<short label on the highlighted region>"
3. Finish: branchdiff agent tour-done --tour <id>
4. Tell the user to view it in the branchdiff UI (Tour panel).

Start: branchdiff agent tour-start
```

#### Workflow 4 — AI Summary

```
Summarize the current branchdiff review session.

1. Run `branchdiff agent list --json` to get all threads.
2. Output:
   - One-sentence status read (e.g. "looks solid", "a few must-fix items left") —
     informal only; never state approve/request-changes, that's `branchdiff review verdict`'s call
   - Top must-fix items (file:line + one-line reason each)
   - Any recurring themes ("three null-check comments" → suggest a lint rule)
   - Count: open / resolved / dismissed
3. Format as markdown, suitable for a PR description. Keep under 150 words.

Start: branchdiff agent list --json
```

#### Workflow 5 — Security Audit

```
You are doing a SECURITY-FOCUSED review using branchdiff.

1. Run `branchdiff agent diff` to see every changed line.
2. Look ONLY for security issues (skip style, perf, naming):
   - Injection: SQL, command, XSS, template, NoSQL, prompt
   - Auth/authz: missing checks, broken session logic, privilege escalation
   - Secrets: hardcoded keys/tokens, values leaked to logs
   - Crypto: MD5/SHA1 for passwords, weak RNG, hand-rolled crypto
   - Deserialization: eval/Function/pickle on untrusted input
   - Path traversal, SSRF, open redirect
   - Dependency risk: vulnerable ranges, typosquat names
3. For each finding:
   branchdiff agent comment --file <p> --line <n> \
     --body "[must-fix] <category>: <what, why it's exploitable, minimal fix>"
   Cite CWE where helpful (e.g. "CWE-89 SQL injection").
4. Zero findings is valid — say so:
   branchdiff agent general-comment \
     --body "[question] No security issues found. Checked: <what you reviewed>."

Start: branchdiff agent diff
```

#### Workflow 6 — Test Coverage Gaps

```
You are finding TEST COVERAGE gaps using branchdiff.

1. Run `branchdiff agent diff` to see additions.
2. For every new function, branch, or error path, check the test directory
   (e.g. **/*.test.ts, tests/**) for coverage.
3. For each uncovered path:
   branchdiff agent comment --file <p> --line <n> \
     --body "[suggestion] No test covers <path>. Suggested:
     describe('<fn>', () => { it('<case>', () => { ... }) })"
4. Priority: error branches > new public API > edge cases > happy path.
   Skip private helpers already exercised transitively.
5. Summarize: N new paths, M covered, K missing.
   branchdiff agent general-comment --body "<summary>"

Start: branchdiff agent diff
```

#### Workflow 7 — Breaking-Change Review

```
You are reviewing a BREAKING CHANGE using branchdiff.
Context: comparing <base-ref> → <new-ref>.

1. Run `branchdiff agent diff`.
2. Classify every change:
   BREAKING: removed exports, changed function signatures, renamed public types,
   removed CLI flags, changed HTTP endpoints, DB schema changes without migration.
   NON-BREAKING: additions, deprecations with shims, internal refactors.
3. For each BREAKING item:
   branchdiff agent comment --file <p> --line <n> \
     --body "[must-fix] BREAKING: <what changed> — callers must <action>.
     Migration: <concrete steps>."
4. Draft an UPGRADE.md snippet:
   branchdiff agent general-comment --body "<breaking changes + before/after + rollback notes>"
5. Flag any schema migration without a rollback path as [must-fix].

Start: branchdiff agent diff
```

#### Workflow 8 — Dependency Review

```
You are reviewing DEPENDENCY CHANGES using branchdiff.

1. Run `branchdiff agent diff` and focus on:
   package.json, pnpm-lock.yaml, yarn.lock, package-lock.json,
   and new import/require lines for added packages.
2. For every ADDED or MAJOR-BUMPED dependency check:
   - Maintained? (last publish < 1 year, reputable owner)
   - License compatible with the project?
   - Bundle size — is it imported in client code?
   - First-party alternative already in the repo?
   - Known CVEs (run npm audit if available)
3. For each finding:
   branchdiff agent comment --file package.json --line <n> \
     --body "[<severity>] <pkg>@<ver>: <risk>. Alternative: <x>."
   [must-fix] = abandoned / GPL in MIT project / critical CVE
   [suggestion] = large bundle / first-party alternative exists
   [question] = unclear why this was added
4. Summarize: added N, removed M, bundle-size delta, license concerns.
   branchdiff agent general-comment --body "<summary>"

Start: branchdiff agent diff
```

---

#### Tips

- **Keep branchdiff running while the AI works.** The `branchdiff` CLI commands (not raw HTTP) talk to the local server for you by using `branchdiff agent ...` / `branchdiff review ...`
- **Pass `--json`** when the agent needs structured output.
- **Short thread IDs work.** First 8 chars of a UUID is enough: `branchdiff agent resolve abc123de`.
- **Nothing leaves your machine.** No telemetry, no cloud, no API key.
- **Multiple sessions open?** Run `branchdiff agent diff | head -3` to confirm which branches the AI is reviewing.

</details>

---

## Platform integrations

Sync review comments between branchdiff and GitHub PRs. Works for both AI-generated and manually posted comments.

<details>
<summary><b>GitHub — Prerequisites, Push local comments, Pull GitHub comments, Requirements for sync</b></summary>

#### Prerequisites
1. Install the [GitHub CLI](https://cli.github.com): `gh --version`
2. Authenticate: `gh auth login`
3. Your repo's git remote must point to `github.com`
4. A PR must be open for your current branch (or use a PR URL: `branchdiff https://github.com/owner/repo/pull/123`)

#### Push local comments to GitHub

When branchdiff detects an open PR, a GitHub button appears in the toolbar showing the PR number — for example, if your PR is #42, the button shows `#42`. Click it to open the sync dialog.

1. Write comments in branchdiff (manually or via AI review)
2. Click the PR number button in the toolbar (e.g. `#42`)
3. Click **Push to PR** — each single-comment thread is posted as an inline review comment on the GitHub PR
4. You'll see a toast showing how many were pushed, skipped (duplicates), or failed

> Only single-comment threads can be pushed. Threads with replies are skipped — GitHub's review comment API doesn't map cleanly to multi-reply threads.

#### Pull GitHub comments into branchdiff

1. Click the `#42` button in the toolbar
2. Click **Pull from PR** — all review comments from the GitHub PR are imported as local threads
3. Duplicate comments (same file, line, and body) are automatically skipped

#### Requirements for sync
- Your local HEAD must match the PR's head commit (push/pull git changes first)
- No uncommitted changes in your working tree (commit or stash first)

</details>

<details>
<summary><b>Bitbucket — Prerequisites, Push, Pull comments,</b></summary>

## Prerequisites

1. Go to [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens) → **Create API token with scopes**
2. Pick the Bitbucket app, and grant it **Read** + **Write** access to repositories and pull requests
3. Set `BITBUCKET_USERNAME` to your **email address** (not Bitbucket username) — Atlassian tokens use email for auth

---

Set credentials after creating the token:

```bash
# Environment variables (restart branchdiff after setting)
export BITBUCKET_USERNAME="your-email@example.com"
export BITBUCKET_API_TOKEN="your-token"
```

```bash
# Config file (more convenient — no restart needed on next run)
mkdir -p ~/.branchdiff
echo '{"bitbucket":{"username":"your-email@example.com","apiToken":"your-token"}}' > ~/.branchdiff/credentials.json
chmod 600 ~/.branchdiff/credentials.json
```

5. Your repo's git remote must point to `bitbucket.org`
6. A PR must be open for your current branch

NOTE: Push and pull work identically to GitHub — click the PR number button in the toolbar (e.g. `#42`).

</details>

---

## Usage Guide

| I want to… | Command |
|---|---|
| See uncommitted changes | `branchdiff` |
| Compare with main (or any base) | `branchdiff main` |
| Compare two branches | `branchdiff main feat` |
| View a GitHub PR | `branchdiff https://github.com/owner/repo/pull/123` |
| Browse repo files | `branchdiff tree` |
| View last N commits | `branchdiff HEAD~3` |
| Compare branch vs parent | `branchdiff -p` |
| Compare branch vs 3rd commit back | `branchdiff -p 3` |
| Only unstaged changes | `branchdiff -p 0` |
| Re-open a running instance | `branchdiff open` |
| Stop all instances | `branchdiff kill` |
| Self-update | `branchdiff update` |
| Check version | `branchdiff version` |
| Show repo info & state | `branchdiff info` |
| View user guide (no repo needed) | `branchdiff guide` |
| View release changelog (no repo needed) | `branchdiff changelog` |

<details>
<summary><b>Full usage guide — diff modes, review sessions, options, troubleshooting</b></summary>

#### Viewing diffs

##### My uncommitted changes

```bash
branchdiff              # unstaged + staged
branchdiff staged       # only staged
branchdiff unstaged     # only unstaged
```

##### Recent commits

```bash
branchdiff HEAD~1       # last commit
branchdiff HEAD~5       # last 5 commits
```

##### Comparing branches or refs

```bash
branchdiff main                 # main vs. current branch
branchdiff main feat            # two branches
branchdiff main..feat           # range syntax (same result)
branchdiff v1.0.0 v2.0.0        # tags
branchdiff 1df74cc 3b9a54d      # commit SHAs
branchdiff origin/main feat     # remote + local
```

Anything `git rev-parse --verify` accepts works.

##### Viewing a GitHub PR

```bash
branchdiff https://github.com/owner/repo/pull/123
```

Requires `gh` CLI installed and authenticated (`gh auth login`).

---

#### Review sessions

branchdiff tracks inline comments in a local SQLite database. How sessions work depends on what you're comparing:

##### Branch comparisons — persistent

When comparing two named branches, tags, or remote branches, your review comments **persist across new commits**. Reopening the same comparison always shows previous comments — just like a GitHub PR thread.

```bash
branchdiff main..feature     # comments survive new commits to either branch
```

To start a fresh review (archive current comments and begin empty):

```bash
branchdiff main..feature --new          # archive + restart
# or: click "New review" in the browser toolbar
```

Archived comments are preserved and accessible:

```bash
branchdiff review threads --session <id>   # view archived session
```

##### Snapshot reviews — ephemeral

Working tree, staged changes, or a specific commit get their own session per HEAD state. Making a new commit creates a new session — old comments are not shown.

##### Summary

| Comparison type | Comments survive new commits? | Start fresh |
|---|---|---|
| `branchdiff main..feature` | Yes | `--new` or "New review" button |
| `branchdiff HEAD~1` | No — new commit = new session | — |
| `branchdiff` (working tree) | No — new commit = new session | — |

---

#### Diff modes

##### Git mode (default)

Standard `git diff branch1..branch2` — compares commit ancestry.

```bash
branchdiff main feat            # git mode is the default
branchdiff main feat --mode git
```

##### File mode

Compares actual file content (blob hashes) at each branch tip, ignoring commit history. Use when branches may have converged via rebase/cherry-pick.

```bash
branchdiff main feat --mode file
```

Example: both branches added the same line via different commits.
- File mode → no change (content is identical)
- Git mode → modified (commit paths differ)

##### Delta mode (Δ) — browser only

Toolbar button. Shows what the two modes disagree on:
- **Git-only (amber)** — appears in git diff but not file diff
- **File-only (blue)** — appears in file diff but not git diff
- **Shared** — both modes agree

---

#### Options

| Flag | Description |
|---|---|
| `--mode <file\|git>` | Diff mode (default: `git`) |
| `--port <n>` | Port (default: auto-assigns from 5391) |
| `--no-open` | Don't auto-open browser |
| `--dark` | Dark theme |
| `--unified` | Unified view (default is split) |
| `--quiet` | Minimal terminal output |
| `--new` | Archive current session and start fresh |
| `-p, --previous [n]` | Compare branch against Nth previous commit (default: 1). Use `-p 0` for unstaged-only view |

**Config file** — stop retyping long flag sets. `~/.branchdiff/config.json` (global) and/or `.branchdiff.json` (a repo root or launch directory) fill in any flag you didn't pass; a flag you actually type always wins, and a repo's own file wins over the launch directory's, which wins over global. A top-level `defaults` key mirrors the root command's flags, `auto` mirrors every `auto` flag — `auto.exec`/`auto.tool` are the one exception, resolved only from global config or a CLI flag, never a `.branchdiff.json` (which can arrive via `git clone`). Run `branchdiff config` to see the fully-merged effective config and where each value came from, or `branchdiff config sample` (`--global` for the global file) to write a starter file with just a few common keys — full details in the [user guide](https://encryptioner.github.io/branchdiff-releases/guideline.html).

---

#### Instance management

Multiple repos open at once — each gets its own port starting at 5391.

```bash
branchdiff list         # show all running instances
branchdiff open         # reopen browser for this repo (prompts to choose if multiple running sessions)
branchdiff kill         # stop all instances
branchdiff prune        # delete all stored data (~/.branchdiff)
branchdiff clear        # reset current repo's review data
branchdiff doctor       # diagnose install / environment issues
branchdiff doctor --notify   # also fire a test desktop notification
branchdiff update       # self-update (auto-detects package manager)
branchdiff version      # print current version
branchdiff version --check  # check for updates
branchdiff info         # show repo fingerprint and state table size
branchdiff config       # print the effective config (defaults/auto) and each value's source
branchdiff state reset  # clear UI state without affecting sessions
branchdiff guide        # open user guide in browser (no repo required)
branchdiff changelog    # open release notes in browser (no repo required)
```

#### PR, sync & session commands

Manage pull requests, sync comments, and control sessions from the terminal. All commands target a running branchdiff instance (supports `--port`/`--pid` for multi-instance environments).

```bash
branchdiff pr info                              # show PR status
branchdiff pr create --title "Fix" --source feat --dest main
branchdiff pr merge --strategy squash           # merge, squash, or rebase
branchdiff pr approve --comment "LGTM"          # approve the PR
branchdiff pr request-changes --comment "Fix X"
branchdiff pr close / reopen / draft / ready
branchdiff pr edit --title "New title"          # edit PR title or body
branchdiff pr comment --body "Nice work"        # add a general comment
branchdiff sync push                            # push local threads → remote PR
branchdiff sync pull                            # pull remote comments → local session
branchdiff session current                      # show active session
branchdiff session archive                      # archive current session
branchdiff session history                      # list archived sessions
branchdiff session delete --id <id>             # delete an archived session
```

Rerunning `branchdiff` in a repo that already has a running instance **reuses** it (just reopens the browser). Use `--new` to force a restart.

---

#### Data & privacy

Everything is local. No outbound calls except:
- `localhost` (UI ↔ CLI server)
- GitHub API via your local `gh` CLI (only for PR viewing and comment sync — only when you click a sync button)

Stored in `~/.branchdiff/`:
- `registry.json` — running instance metadata
- `<repo-hash>/` — per-repo SQLite with comment threads

Wipe everything: `branchdiff prune`

---

#### Troubleshooting

**"Not a git repository"** — run from inside a git working tree.

**Port already in use** — use `branchdiff --port 7000`.

**UI won't load / stale state** — run `branchdiff --new`.

**Native module errors (`better-sqlite3`)** — happens after switching Node versions:
```bash
npm rebuild -g better-sqlite3
```

**"GitHub CLI (gh) is not installed"** — install from <https://cli.github.com> then `gh auth login`.

**Something else** — run `branchdiff doctor`.

---

#### Uninstall

```bash
npm uninstall -g @encryptioner/branchdiff
branchdiff prune          # or: rm -rf ~/.branchdiff
```

</details>

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `j` / `k` | Next / previous file |
| `n` / `p` | Next / previous hunk |
| `Shift+X` | Collapse / expand all |
| `?` | Show all shortcuts |

---

## Why branchdiff?

Standard `git diff` compares commit ancestry — it can show a "change" when both branches actually contain identical content (just via different commits). branchdiff's **file mode** compares actual file content at each branch tip.

<details>
<summary><b>Example — how file-mode differs from git diff</b></summary>

```
main:  A → B → C → D   (file.js = "hello world")
feat:  A → X → Y       (file.js = "hello world")

git diff main..feat  →  shows diff  (different commit paths)
branchdiff main feat →  no diff     (same content)
```

Switch between modes in the browser toolbar, or use `--mode file` / `--mode git`.

</details>

---

## Features

<details>
<summary><b>Full feature list</b></summary>

- Syntax highlighting (150+ languages), split and unified views
- **Binary file handling** — type badges (Image, PDF, Font, Archive, ...); recognized images render inline, old vs new side by side at the compared refs
- Inline comments with severity tags (`[must-fix]`, `[suggestion]`, `[nit]`, `[question]`)
- **Markdown preview** in comment editor — toggle between Write and Preview before posting
- **Persistent review sessions** — comments survive new commits when comparing named branches
- Full view mode — VS Code-style side-by-side full file view with inline comments and scroll markers
- Delta mode (Δ) — highlights what each diff mode reports differently
- **Sidebar filtering** — filter files by 9 states: Commented, Uncommented, Viewed, Unviewed, Stale, Collapsed, Expanded, Staged, Unstaged
- **File status indicators** — inline badges on file rows: S (staged), U (unstaged), amber dot (stale), checkmark (viewed)
- **Stale viewed detection** — viewed files auto-flagged when content changes (FNV-1a hash)
- **UI state persistence** — collapse state, viewed markers, and preferences persist across ports and machines
- **Working tree toggle** — switch between staged and unstaged changes from the toolbar
- GitHub & Bitbucket PR integration — push/pull review comments, create PRs from the UI
- **CLI commands for PR, sync & session** — manage PRs, sync comments, and control sessions from the terminal (`branchdiff pr`, `branchdiff sync`, `branchdiff session`)
- **Automatic PR review** (`branchdiff auto`) — watches open PRs, reviews the ones with new commits, asks first, notifies on your desktop, publishes only with `--push`; `--skill` drives an actual review skill instead of the JSON pipe, no install needed
- **Multi-repo review** — `auto --repo-paths ~/work` (or just running it from a parent directory) scans every repo at once, lists their PRs together, and reports what each pass reviewed and where the sessions are
- **Worktree reviews** (`--worktree`) — review a PR in `.worktrees/` without switching your branch; each AI review is pinned to its own session; `branchdiff list` and the UI show the worktree path when one is active
- **Commit history browser** — `branchdiff history` (log up to any ref or range), `branchdiff show <ref>` (repo at a commit), per-file history that follows renames
- **Local-only resolve** — resolving a thread never touches the PR unless you pass `--sync`
- **Session isolation** — `--session`/`--port` on every review command; with several sessions live branchdiff lists them instead of guessing, so concurrent reviews never cross wires
- **Skills where you want them** — `branchdiff skill add --target` installs into this repo, your home directory, or opencode's own directories; re-running updates them in place
- **Remote branches without the ceremony** — comparing a branch that only exists on the remote fetches and tracks it for you
- Multiple repos open simultaneously on different ports
- 100% local — no telemetry, no cloud, no API key

</details>

---

## Guideline

View the complete user guide and command reference:

- **Online:** [encryptioner.github.io/branchdiff-releases/guideline.html](https://encryptioner.github.io/branchdiff-releases/guideline.html)
- **After installation:** Run `branchdiff guide` (opens at `http://localhost:<port>/guideline`)
- **Workflows included:** AI review, resolve, tour creation, security audit, test coverage, breaking changes, dependency review, PR summary

## Changelog

View the release history and what's changed:

- **Online:** [encryptioner.github.io/branchdiff-releases/changelog.html](https://encryptioner.github.io/branchdiff-releases/changelog.html)
- **After installation:** Run `branchdiff changelog` (opens at `http://localhost:<port>/changelog`)

## License

Commons Clause + MIT — see [LICENSE.md](https://github.com/Encryptioner/branchdiff-releases/blob/master/LICENSE.md) (browse via npm code tab) for full text.

## Contributing

Feedback and bug reports are welcome on the [GitHub repo](https://github.com/Encryptioner/branchdiff-releases).
More projects by the author: [github.com/Encryptioner](https://github.com/Encryptioner).
His portfolio: [encryptioner.github.io](https://encryptioner.github.io).

If you find branchdiff useful, consider giving it a [star on GitHub](https://github.com/Encryptioner/branchdiff-releases)!

## Support

If branchdiff saves you time, consider supporting its development:

[![SupportKori](https://img.shields.io/badge/SupportKori-☕-FFDD00?style=flat-square)](https://www.supportkori.com/mirmursalinankur)

## Acknowledgments

Inspired by [Diffity](https://github.com/kamranahmedse/diffity)
