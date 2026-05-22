---
name: branchdiff-resolve
description: >-
  Read open review comments and resolve them by making code fixes. Use this
  skill when the user asks to fix review comments, resolve threads, address
  feedback, or handle code review findings. Also triggers for "fix the issues",
  "address the review", "resolve comments", or any request to act on code
  review feedback from branchdiff.
user-invocable: true
---

# branchdiff Resolve Skill

You are reading open review comments and resolving them by making the requested code changes.

## Arguments

- `url` (optional, **preferred**): A URL identifying what to resolve. Three forms are accepted:

  **A. Branchdiff URL** (session is already running):
  ```
  http://localhost:5391/diff?b1=origin%2Fdevelopment&b2=origin%2Ffeature&mode=git
  ```
  The skill extracts host+port and `b1`/`b2` from the query.

  **B. GitHub PR URL** (auto-creates a session if none exists):
  ```
  https://github.com/owner/repo/pull/123
  ```

  **C. Bitbucket PR URL** (same — auto-creates a session):
  ```
  https://bitbucket.org/workspace/repo/pull-requests/123
  ```

- `thread-id` (optional): Resolve a specific thread by ID instead of all open threads. Example: `/branchdiff-resolve abc123`

- `ref` (optional, fallback): The git ref that was reviewed. If a matching session is already active it is reused; if not, a new session is started. Accepts:
  - Single ref: `HEAD~3`, `main`, `v1.0.0`
  - Range: `main..feature`, `HEAD~5..HEAD`
  - Two refs (branch comparison): `main feature`
  Defaults to working tree session.

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
   - If there is no active session, start one:
     ```bash
     branchdiff <b1> <b2> --no-open
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
     (Or run the **/branchdiff-review** skill first — it starts the session.)
     Use Bash tool with `run_in_background: true`. Wait 2 seconds, then verify with `branchdiff agent list`.

## Need more context?

If you are unsure about any command, flag, or workflow detail, run:

```bash
branchdiff review guide
```

This prints the full agent reference — CLI commands, review/resolve workflows, multi-instance safety rules, and the JSON schema for import. Read it before proceeding if anything below is unclear.

## Instructions

### Step 1: List open threads

```bash
branchdiff agent list --status open --json
```

If a `thread-id` argument was provided, filter to just that thread. The JSON output includes the full comment body, file path, line numbers, and side for each thread.

If there are no open threads, tell the user there's nothing to resolve.

### Step 2: Process each thread

For each open thread, check the `comments` array and `author.type` field (`"user"` or `"agent"`):

a. **Skip** general comments (filePath `__general__`) — these are summaries, not actionable code changes.

b. **Skip** threads where the last comment is an agent reply that asks the user a question (e.g. "Could you clarify...?") and the user hasn't responded yet — the agent is waiting for user input. Still process threads where the agent left the original comment (code suggestion, review feedback) — those are actionable.

c. **Read the comment body** and understand what change is requested. Interpret the intent:
   - If it suggests a code change, make the change.
   - If it suggests adding documentation, add or update the relevant docs.
   - If it asks a question that implies action (e.g. "should we add X?"), treat it as a request to do that.
   - If genuinely unclear, reply asking for clarification:
     ```bash
     branchdiff agent reply <thread-id> --body "Could you clarify what change you'd like here?"
     ```

d. **Read the relevant source file** to understand the full context around the commented lines, then make the requested change using the Edit tool.

e. **Resolve the thread** with a summary:
   ```bash
   branchdiff agent resolve <thread-id> --summary "Fixed: <brief description>"
   ```

   If the comment raises a valid concern but the fix shouldn't be applied now, dismiss instead:
   ```bash
   branchdiff agent dismiss <thread-id> --reason "<why it won't be addressed>"
   ```

### Step 3: Confirm and surface the session

```bash
branchdiff agent list
```

Verify all applicable threads are resolved. Then run `branchdiff list` to pull the active session URL and **always print it back to the user** so they can jump straight to the browser view:

```bash
branchdiff list
```

Extract the URL line (e.g. `http://localhost:5391`) for the current repo and include it in your final message. Tell the user the resolve pass is complete and link the session:

> Resolved N threads. Resolved status appears in the browser within ~2 seconds.
>
> Session: http://localhost:5391

## Notes

- Use the 8-char prefix of the thread `id` as `<thread-id>`
- A thread can be resolved even if the fix is on a different line than the original comment
- Use `--reason` in `dismiss` to leave context for other reviewers
- Run `branchdiff agent list --status resolved` to see everything that has been resolved
