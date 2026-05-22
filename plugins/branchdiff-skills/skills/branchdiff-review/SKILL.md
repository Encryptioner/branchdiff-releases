---
name: branchdiff-review
description: >-
  Review the current git diff using branchdiff agent commands. Use this skill
  whenever the user asks for a code review, wants feedback on their changes,
  mentions reviewing a diff or PR, or asks to check their code for issues.
  Also triggers for "look at my changes", "what's wrong with this diff",
  "check for bugs", or any request to evaluate code changes.
user-invocable: true
---

# branchdiff Code Review Skill

You are reviewing a git diff and leaving inline comments using the `branchdiff agent` CLI.

## Arguments

- `url` (optional, **preferred**): A URL identifying what to review. Three forms are accepted:

  **A. Branchdiff URL** (from your browser — session is already running):
  ```
  http://localhost:5391/diff?b1=origin%2Fdevelopment&b2=origin%2Ffeature&mode=git
  ```
  From this URL the skill extracts:
  - **Server** → `http://localhost:5391` (already running — skip session start)
  - **Base branch (b1)** → URL-decode the `b1` param (e.g. `origin/development`)
  - **Source branch (b2)** → URL-decode the `b2` param (e.g. `origin/feature`)
  - **Mode** → the `mode` param (`git`, `file`, etc.)

  **B. GitHub PR URL** (no session needed — branchdiff auto-creates one):
  ```
  https://github.com/owner/repo/pull/123
  ```

  **C. Bitbucket PR URL** (same — auto-creates a session):
  ```
  https://bitbucket.org/workspace/repo/pull-requests/123
  ```

  For PR URLs, branchdiff checks out the PR locally, derives the base/compare refs, and starts a session — you don't pass refs separately.

- `ref` (optional, fallback): Git ref to review when no URL is available. Accepts:
  - Single ref: `HEAD~3`, `main`, `v1.0.0`
  - Range: `main..feature`, `HEAD~5..HEAD`
  - Two refs (branch comparison): `main feature` — starts session as `branchdiff main feature --no-open`
  Defaults to working tree changes.

- `focus` (optional): Focus the review on a specific area. One of: `security`, `performance`, `errors`, `types`, `logic`. If omitted, review everything.

## CLI Reference

```bash
branchdiff agent diff                    # Output unified diff for current session
branchdiff agent list [--status open|resolved|dismissed] [--json]
branchdiff agent comment --file <path> --line <n> [--end-line <n>] [--side new|old] --body "<text>"
branchdiff agent general-comment --body "<text>"
branchdiff agent resolve <id> [--summary "<text>"]
branchdiff agent dismiss <id> [--reason "<text>"]
branchdiff agent reply <id> --body "<text>"
```

- `--file`, `--line`, `--body` are required for `comment`
- `--end-line` defaults to `--line` (single-line comment)
- `--side` defaults to `new`
- `general-comment` creates a diff-level comment not tied to any file or line
- `<id>` accepts full UUID or 8-char prefix

## Prerequisites

1. Check that `branchdiff` is available: run `which branchdiff`. If not found, install it with `npm install -g @encryptioner/branchdiff`.

2. **Resolve session from argument:**

   **If a branchdiff URL was provided** (`http://localhost:5391/diff?b1=...&b2=...`):
   - URL-decode the `b1` and `b2` query params to get the base and source branches.
   - Note the host+port (e.g. `http://localhost:5391`) — the server is already running.
   - Run `branchdiff agent list` to confirm an active session exists. If it does, proceed.
   - If there is no active session (or the session refs don't match b1/b2), start one:
     ```bash
     branchdiff <b1> <b2> --no-open   # e.g. branchdiff origin/development origin/feature --no-open
     ```
     Use Bash tool with `run_in_background: true`. Wait 2 seconds, then verify with `branchdiff agent list`.

   **If a GitHub/Bitbucket PR URL was provided** (e.g. `https://github.com/owner/repo/pull/123` or `https://bitbucket.org/ws/repo/pull-requests/123`):
   - Pass the PR URL directly to branchdiff — it checks out the PR, derives base/compare refs, and starts the session:
     ```bash
     branchdiff <pr-url> --no-open
     ```
     Use Bash tool with `run_in_background: true`. PR URLs can take 5–15 seconds (network calls). Wait, then verify with `branchdiff agent list`.
   - Prerequisites:
     - **GitHub**: `gh` CLI installed and authenticated (`gh auth status`).
     - **Bitbucket**: `BITBUCKET_USERNAME` and `BITBUCKET_API_TOKEN` env vars set.

   **If only a `ref` was provided (no URL):**
   - Start a session matching the ref if one isn't already active:
     - Working tree: `branchdiff --no-open`
     - Specific ref or HEAD: `branchdiff HEAD~3 --no-open`
     - Branch comparison: `branchdiff <base> <compare> --no-open`
     Use Bash tool with `run_in_background: true`. Wait 2 seconds, then verify with `branchdiff agent list`.

   **Alternative — no session needed** (generates diff context only, no inline comments):
   ```bash
   branchdiff review context --refs "main feature" | claude -p "review these changes"
   branchdiff review context --refs "main..feature" | your-ai-tool
   ```

## Need more context?

If you are unsure about any command, flag, or workflow detail, run:

```bash
branchdiff review guide
```

This prints the full agent reference — CLI commands, review/resolve workflows, multi-instance safety rules, and the JSON schema for import. Read it before proceeding if anything below is unclear.

## Instructions

### Step 1: Check previous review context

Before reviewing, check if this is a follow-up review on an already-discussed diff:

```bash
branchdiff agent list --status resolved --json
branchdiff agent list --status dismissed --json
```

If there are resolved/dismissed threads:
- **Do not re-raise issues that were already resolved.** The author addressed them.
- **Check if dismissed issues were truly safe to dismiss** — only flag if new evidence contradicts the dismissal reason.
- **Acknowledge improvements** in your general comment when the author clearly addressed prior feedback.

This makes nth-time reviews additive, not repetitive.

### Step 2: Get the diff

```bash
branchdiff agent diff
```

This outputs the full unified diff for the current session. Line numbers are in the `@@` hunk headers.

### Step 3: Understand the change

Before looking for problems, build a mental model of the diff:

1. **What is this change trying to accomplish?** (new feature, bug fix, refactor, config change)
2. **What are the key decisions the author made?** Read commit messages (`git log --oneline`) for context.
3. **Which files are structural changes vs. core logic?**

Then read all relevant CLAUDE.md (or GEMINI.md, AGENTS.md) files — the root one and any in directories containing modified files. These define project-specific rules.

#### Assess the diff size and adapt your strategy

- **Small** (under ~100 changed lines, 1-3 files): Review each file in order.
- **Medium** (100-500 changed lines, 3-10 files): Group files by area. Review core logic first.
- **Large** (500+ changed lines or 10+ files): Group by area. Start with core logic. For repetitive changes (e.g. same rename in 20 files), verify the pattern on the first few, then check remaining instances for deviations.

No matter the size, **read and review every changed file**. Do not skip or spot-check.

### Step 4: Analyze the code

For each changed file, read the **entire file** (not just the diff hunks) to understand full context. Then apply these analysis passes:

**Data flow analysis** — Trace values through the changed code:
- Can a value be null/undefined where the code assumes it isn't?
- If a function's return type changed, do all callers handle the new shape?
- Are there narrowing checks the diff accidentally moved outside of?

**State and lifecycle analysis** — For stateful code (React state, DB transactions, streams):
- Does the change create unreachable or inescapable states?
- Are resources still cleaned up on all paths?
- Can concurrent access corrupt shared state?

**Contract analysis** — Check against caller expectations:
- Does the function still satisfy what callers expect? Read the callers.
- Does it still conform to interfaces or base methods?
- For API endpoints: does the response shape match what clients expect?

**Boundary analysis** — For system boundaries (user input, network, file I/O):
- Is user input validated before use?
- Are there injection vectors (SQL, shell, XSS, path traversal)?

**Edge case analysis** — Only for cases that *will* happen in practice:
- Empty arrays/strings, zero, negative numbers
- Off-by-one in loops, slices, or index arithmetic

If a `focus` argument was provided, concentrate on that area. Otherwise, apply all passes.

#### Completeness check

After analyzing correctness, check whether the change is **complete**:
- New behavior without tests? Flag as `[suggestion]`.
- Bug fix without regression test? Flag.
- Schema change without migration? New env var without docs? Flag clearly needed missing pieces.

#### What to flag

- Code that will fail to compile, parse, or run
- Logic errors producing wrong results
- Security vulnerabilities in changed code
- Race conditions or data loss risks with concrete scenarios
- Project rule violations (quote the exact rule)
- Broken contracts — changed function no longer satisfies callers
- Missing tests for new/changed behavior (as `[suggestion]`)
- Incomplete changes clearly needed for correctness

Skip style concerns, linter-catchable issues, and pre-existing problems in unchanged code.

#### Validate before commenting

For each finding, verify it's real:
- Re-read surrounding code — many apparent bugs disappear in full context
- For "missing import" claims, grep to confirm
- For broken callers, read the actual call sites
- For project rule violations, confirm the rule applies to this file

If a pattern repeats across files, comment on the first occurrence and mention the pattern in the general summary.

### Step 5: Post comments

**Order by severity.** Post all `[must-fix]` first, then `[suggestion]`, then `[question]`.

**Severity tags** (prefix `--body` with exactly one):
- `[must-fix]` — Bugs, security issues, data loss risks. Code that will break.
- `[suggestion]` — Concrete improvements with clear reasoning. Includes missing tests and incomplete changes.
- `[question]` — Something unclear needing clarification.

#### Review tone

You are reviewing code written by a human who spent effort on it. Be respectful and constructive:
- **Lead with the problem, not a judgment.** Say "this will return undefined when X is empty" not "this is wrong".
- **Use collaborative language.** "Consider using X here" or "We might want to handle Y" reads better than "You should" or "This is bad".
- **Acknowledge good code.** If a section is well-written, a brief "nice approach" goes a long way.
- **Be concise.** The author will read every comment. Respect their time.
- **Explain the *why*.** For suggestions, explain the reasoning — don't just prescribe a fix.

For each finding:
```bash
branchdiff agent comment --file <path> --line <n> [--end-line <n>] --body "[severity] <comment text>"
```

- Lead with the problem, not background. Be specific and actionable.
- For small fixes, include a code suggestion showing the fix.
- For larger fixes, describe the issue and approach without a full code block.

**General comment guidance:**
- No findings → "No issues found. Checked for bugs and project rule compliance."
- 1-2 findings → skip general comment unless there's a cross-cutting concern.
- 3+ findings → leave a general comment summarizing themes.
- Large diffs → always leave a general comment noting scope and grouping findings by area.

```bash
branchdiff agent general-comment --body "<overall summary>"
```

### Step 6: Confirm and surface the session

```bash
branchdiff agent list
```

Verify all comments were posted. Then run `branchdiff list` to pull the active session URL and **always print it back to the user** so they can jump straight to the browser view:

```bash
branchdiff list
```

Extract the URL line (e.g. `http://localhost:5391`) for the current repo and include it in your final message. Tell the user the review is complete, summarize findings, and link the session:

> Review complete — X must-fix, Y suggestions, Z questions.
>
> Session: http://localhost:5391
>
> When you are ready, run **/branchdiff-resolve** to fix them.
