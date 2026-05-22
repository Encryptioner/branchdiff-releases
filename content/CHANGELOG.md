<!-- AUTO-GENERATED - DO NOT EDIT IN THIS REPO. Source of truth: private repo. Edits here will be overwritten on the next release. -->

# Changelog

All notable changes to `branchdiff` are documented here.

---

## [1.6.1] - 2026-05-21

### Added

- **Final UI ↔ CLI parity pass** — four CLI commands fill the last UI-only gaps: `agent revert-file`, `agent revert-hunk` (stdin or `--patch`), `agent delete-tour`, and `sync push-thread <id>`. AI agents can now perform every UI mutation from the terminal.
- **`branchdiff agent guide` Supported Refs section** — documents that `b1`/`b2` accept branches, **tags**, SHAs, and `HEAD~N` (validated via `git rev-parse --verify`), with worked examples.
- **`branchdiff pr` command group** — 11 subcommands for PR lifecycle operations from the terminal: `info`, `create`, `merge`, `approve`, `request-changes`, `close`, `reopen`, `draft`, `ready`, `edit`, `comment`. Targets a running branchdiff instance via HTTP. Platform (GitHub/Bitbucket) auto-detected; override with `--platform`.
- **`branchdiff sync` command group** — 2 subcommands for comment sync from the terminal: `push` (local threads → remote PR), `pull` (remote PR → local session). Shows created/updated/skipped counts.
- **`branchdiff session` command group** — 4 subcommands for session management from the terminal: `current`, `archive`, `history`, `delete`.
- **Agent thread/comment CRUD** — 4 new `agent` subcommands: `delete-thread`, `clear-threads`, `edit-comment`, `delete-comment`. Use DB directly (matching existing agent pattern).
- **Multi-instance targeting** — All `pr`, `sync`, and `session` commands accept `--port`, `--pid`, or default to current repo. Lists matching instances when ambiguous.
- **`branchdiff agent guide`** — Outputs a comprehensive CLI reference for AI agents, covering all commands grouped by workflow (comments, PR lifecycle, sync, sessions, review pipeline). Distinct from `review guide` which covers review/resolve workflows only.
- **Sync All button in PR dialog** — GitHub and Bitbucket comment sync dialogs now have a one-click **Sync All** that pulls from the PR then pushes local threads, replacing the manual pull-then-push workflow.
- **Per-thread PR sync badge** — Each comment thread shows a platform icon (GitHub/Bitbucket) with a colored dot: green = synced with the remote PR, amber = not yet pushed. Clicking opens a dropdown with **Push this thread**, **Pull all from PR**, and **Sync all**. Only visible when a PR is active. Visibility requires an active PR.
- **DB-backed sync tracking** — `synced_at` column on `comment_threads` tracks whether each thread is in sync with the remote PR. Set on successful push or pull (both new and matched threads); cleared when a user adds a reply or edits a comment. Fixes the stale "N threads to push" count that persisted after a successful push.
- **General PR comments pulled** — Pull now includes PR-level (non-inline) comments from both GitHub (`/issues/{n}/comments`) and Bitbucket (comments without `inline.path`). These appear in the General Comments panel. Previously only inline review comments were pulled.
- **Persistent sync status bar in dialog** — The sync dialog always shows a green/amber strip with the current sync state ("All local threads synced" or "N not yet pushed"), derived from DB state rather than ephemeral operation results. Survives modal close/reopen.
- **General-comments jump button** — The toolbar now shows a comment-icon badge with a count of unresolved general comments when any exist. Clicking it expands the General Comments panel and scrolls to its first thread. Symmetric to the existing per-file comment counter.
- **First-open preview-pull badge** — The PR sync dialog (GitHub and Bitbucket) automatically previews remote comments the first time it opens. If any remote threads or replies aren't local yet, the pull section shows an amber **N new** chip and an inline hint, so users know whether a pull is needed without running one. Works without writing to the DB — uses a dry-run preview endpoint.
- **Push-pending-comments-first checkbox** — The Request Changes confirm dialog now offers a checkbox (default ON) that pushes any unsynced local comments to the PR before submitting the review. Available for both GitHub and Bitbucket (previously the push-before flow only existed for Bitbucket).
- **Last-review timestamp in `branchdiff list`** — `branchdiff list` now shows when each running instance last ran a `review run` / `review import` and sorts most-recently-reviewed first. Useful for finding "which session did I just AI-review?" across multi-repo setups.
- **Page-scrollable commit detail view** — On `/commit?hash=...`, the commit header (subject + body) now scrolls with the diff content instead of locking top space. Long commit messages no longer dominate the viewport.
- **`branchdiff review run --url <url>`** — new flag accepting a branchdiff localhost URL, a GitHub PR URL (`https://github.com/owner/repo/pull/N`), or a Bitbucket PR URL (`https://bitbucket.org/ws/repo/pull-requests/N`). For PR URLs, branchdiff spawns a detached session (or reuses an existing one for the same repo+refs) before piping context to `--exec`. Identifies the resulting instance via the spawned child's banner output so it works correctly even when multiple sessions are running for the same repo with different ref pairs.
- **Session locator footer** — `branchdiff review run` and `branchdiff review import` now print the active session's URL, port, pid, and ref at the end of every run, so it's trivial to jump back to the browser view after an AI pass. Lookup is ref-exact (`findInstanceForRepoAndRef`) so the footer points at the correct session when multiple coexist for the same repo.
- **Expand-commits toggle in sidebar** — Commits filter row now has an expand/collapse button (`ExpandAll`/`CollapseAll` icons) next to the search input. Clicking it grows the commit list to fill the remaining sidebar height and auto-collapses the Files section; clicking again restores both. Guards reset the expansion if the user re-opens Files manually or collapses the Commits header.
- **PR URL support in `/branchdiff-review` and `/branchdiff-resolve` skills** — the generated Claude Code skill markdown documents three URL forms: branchdiff localhost, GitHub PR, and Bitbucket PR. PR URLs delegate to `branchdiff <pr-url> --no-open` so the existing GitHub/Bitbucket checkout + base/compare derivation is reused. Skills also instruct the AI to always echo the session URL back to the user when finishing.

### Changed

- **Consistent startup output** — All startup paths now print the same banner: title, `PORT`, `pid`, status tag, description, and URL. Covers foreground, `--detach` (Background), "already running", and `branchdiff tree`. Previously `branchdiff tree` showed no PORT/PID and the detach path was missing the `branchdiff` header.
- Commit view now defaults to **split** instead of unified, matching the diff page behavior.
- **PR dialog comment count** no longer goes stale after a pull — the count now live-syncs from the fetched PR details without needing to close and reopen the dialog.
- **"Threads to push" counter** now only counts unsynced threads (not already-pushed ones), fixing the bug where the count remained non-zero after a successful push.
- **PR dialog pull section layout** — the "N new" indicator moves from an inline chip inside the title text to an amber-colored subtitle line. The Pull button stands alone on the right, giving the left column enough room for the thread count and status text without crowding.
- **Merge commits visually identified** — both the main commit list and the branch comparison commit sidebar now show a small purple `merge` badge next to any commit with 2+ parents. Detected from `git log --format=%P` (parent hashes), so squash-merged and fast-forwarded commits are correctly excluded.

### Fixed

- **Refresh button now picks up unstaged and newly-staged edits** — clicking Refresh on the staleness banner sometimes still showed old file contents; a full browser reload was the only workaround. Refresh now reliably loads the latest content for both unstaged and staged files.
- **Refresh preserves your scroll position** — clicking Refresh used to jump you away from the file you were reading because rows briefly collapsed to placeholder heights while diffs reloaded. The view now stays anchored on the file you were on.
- **Clicking a file in the sidebar lands on the right file** — when the file's diff hadn't been loaded yet, scrolling would land in the wrong place and the file was hard to find. Sidebar clicks (and jumps from staged/unstaged chips and thread links) now load the file's diff first, so it ends up at the top of the view on the first click.
- **Sync status disappearing after modal reopen** — matched threads (threads that existed locally and corresponded to a remote comment) were not marked `synced_at` in the DB. They now are, so closing and reopening the dialog shows the correct persisted state.
- **PR badge position** — moved to after the Collapse button and before the Delete icon in the thread header, keeping action buttons uninterrupted.
- **False "N local threads not pushed" badge after a successful push** — when a single thread in a batch failed (e.g. its file wasn't in the PR diff yet), the old all-or-nothing logic left every other successfully-pushed thread marked as unsynced. Push now returns a `syncedThreadIds` list and the server marks exactly those threads, so partial-success batches no longer leave stale "unpushed" badges. Applies to both GitHub and Bitbucket.
- **`branchdiff review run` killing long AI calls** — default exec timeout raised from 120s → 600s, stdin writes now honor backpressure (avoids hangs on large diff contexts), `EPIPE` from short-circuiting child processes is swallowed, a force-`SIGKILL` fallback runs 2s after `SIGTERM` so unresponsive tools can't leave zombies, and the result promise is now latched so we don't double-resolve when both timeout and `close` fire.
- **Port-reuse session safety** — when a browser tab is left open on port 5391 and a *different* review session later runs on the same port, the UI now blocks all API traffic until the user refreshes (previously only a different *repo* triggered the gate). The server also rejects any request carrying a stale `X-Branchdiff-Server-Id` with `409 STALE_SERVER`, closing the race window between server restart and the UI's next `/api/info` poll. Comments from the wrong session can no longer be shown.

---

## [1.6.0] - 2026-05-13

### Added

- **Background mode with `--detach`** — `branchdiff main --detach` (short: `-d`) runs the server in the background and returns the terminal prompt immediately. The diff URL is printed before detaching. Background instances are tracked in `~/.branchdiff/logs/`. Combine with any flags: `branchdiff main feat --detach --dark`.
- **`branchdiff killall`** — stop all running branchdiff instances from any directory. `branchdiff kill` now requires a target flag (`--port`, `--pid`, or `--repo`); bare `kill` shows guidance to use `killall` or specify a target.
- **Diff URLs in `branchdiff list`** — each running instance now shows its full diff URL (e.g. `http://localhost:5391/diff?ref=main&b1=main&b2=feat&mode=git`) alongside port, PID, repo, and uptime. Copy-paste friendly.
- **PR URLs with query params** — passing a GitHub or Bitbucket PR URL with query parameters (e.g. `?atlOrigin=...` from chat notifications) no longer fails. Query params and fragments are stripped before parsing.
- **Close session from the browser** — every 3-dot menu now has a **Close session** button. Clicking it stops the server process (via `/api/kill`) and closes the browser tab. No need to switch to the terminal.
- **Rich-text comment editor** — comment input is now a WYSIWYG editor (Milkdown/ProseMirror). Markdown formats as you type: bold/italic via `**`/`*`, inline code via backtick, fenced code blocks, headings, lists, blockquotes, and strikethrough. No Write/Preview toggle needed. Comments are stored as standard GFM and render correctly when synced to GitHub or Bitbucket.

### Fixed

- **Sidebar file click now expands collapsed files** — Clicking a file in the sidebar scrolled to it but left it collapsed, making the diff hard to find. The file is now automatically expanded before scrolling. Keyboard file navigation (J/K) has the same fix.
- **Stale diff refresh now works without hard reload** — When files changed on disk, clicking "Refresh" in the staleness banner did not always reflect updated changes. The refresh handler now awaits refetch completion before resetting the staleness baseline, so fresh data is always rendered. Previously a browser hard reload (Ctrl+Shift+R) was needed.
- **Bitbucket Request Changes sets reviewer state** — The action was posting a comment instead of calling the dedicated `/request-changes` API endpoint. The reviewer state now correctly changes to "changes requested" and the toolbar badge shows the red `✗` indicator.
- **Comments auto-sync when requesting changes on Bitbucket** — Unresolved local comment threads are now automatically pushed to the PR before the request-changes action executes, so all feedback arrives together in one notification.

### Changed

- **Smaller downloads (36% UI bundle reduction)** — Syntax highlighting bundle trimmed from 334 to 79 languages, themes from 42 to 2, and the WASM engine replaced with a JS regex engine. Binary downloads are smaller across Homebrew, Scoop, PyPI, and direct downloads. Fully offline-compatible — no internet required.

---

## [1.5.1] - 2026-05-10

### Added

- **Bitbucket merge strategy selection** — The merge confirmation dialog now shows a strategy picker for Bitbucket PRs: **Merge commit**, **Squash**, and **Fast-forward**. The selection is sent as `merge_strategy` to the Bitbucket API. Previously Bitbucket always used the repository default.
- **`-p 0` shows unstaged changes only** — `--previous` now accepts `0` as an alias for `branchdiff unstaged`. Useful for quickly reviewing what an AI coding agent just changed before staging. Combining a source ref with `-p 0` is rejected since unstaged changes are repo-local, not branch-relative.

### Fixed

- **`branchdiff unstaged` and `branchdiff staged` now show changes** — A regression in ref validation rejected the working-tree pseudo-refs (`unstaged`, `staged`, `work`, `.`) because `git rev-parse --verify` returns no match for them. The `/api/diff` validator short-circuited to an empty diff before the resolver could route them. `isValidGitRef` now treats pseudo-refs as valid, restoring the documented behavior.
- **Bitbucket PR approve no longer returns 400** — Approving a PR via the toolbar failed because `Content-Type: application/json` was sent on bodyless POST requests. Bitbucket's API rejected the empty body. Content-Type is now only set when a request body exists, and empty success responses are handled gracefully.
- **Bitbucket reviewers now display correctly** — Two bugs prevented reviewer info from showing: (1) the code looked for a `user` wrapper on `reviewers[]` items that does not exist in the Bitbucket API — fields are directly on each item; (2) reviewers awaiting review were incorrectly shown as "commented" because `participants[]` with `state: null` was treated as having commented. Defaults to `pending` and only maps `'commented'` for explicit non-null participant states.
- **GitHub `DISMISSED` reviewer state now handled** — Admin-dismissed reviews were not in the recognized states set and fell back to `PENDING`. `DISMISSED` is now recognized and rendered correctly.
- **Bitbucket SUPERSEDED PRs no longer show Reopen** — The `SUPERSEDED` state was incorrectly grouped with closed PRs, causing a Reopen button to appear for an operation the Bitbucket API does not support. Reopen is now only shown for `DECLINED` and `CLOSED`.
- **GitHub Comment action now posts a standalone comment** — The action was using `gh pr review --comment`, which creates a formal review object. Changed to `gh pr comment` for a regular PR comment.
- **PR action errors now shown inline in dialogs** — Errors from the confirm dialog (merge, close, request changes, comment) and the edit PR modal now appear inline inside the modal. The dialog stays open on failure so the user can read the error and retry without losing typed input. Non-modal actions (approve, mark draft, reopen) still show the toolbar error banner.
- **Platform detection when both GitHub and Bitbucket PRs exist** — The active platform was always resolved as GitHub when both PRs were present. The platform is now captured at action-trigger time.
- **ESLint unused variable error resolved** — The `actionLoading` state in the toolbar was declared but never read. Fixed with the skip-destructure pattern.

### Changed

- **Request Changes comment is now optional** — The comment field when requesting changes is no longer required. Both platforms always update the PR review status — a default message is posted when no comment is provided.

---

## [1.5.0] - 2026-05-08

### Added

- **PR lifecycle actions from the toolbar** — The platform PR badge now opens a dropdown menu with full PR management. The badge shows a colored state dot (green = open, purple = merged, red = closed/declined) and the dropdown header displays reviewer status pills showing each reviewer's state (approved ✓, changes requested ✗, commented 💬, pending ○). Available actions adapt to PR state: open PRs get Approve, Request Changes, Comment, Merge, Close, Draft toggle, and Edit; closed PRs show Reopen; merged PRs show no lifecycle actions. Destructive actions (merge, close, request changes) show a confirmation dialog. Comment action requires a message. Works for both GitHub and Bitbucket. The toolbar refreshes automatically after each action.
- **PR state and reviewer visibility** — The toolbar fetches PR state (open/closed/merged/declined) and reviewer status from GitHub and Bitbucket APIs. Reviewer states are deduplicated to show the latest review per reviewer. Bitbucket reviewer states are normalized to match GitHub's format across the UI.
- **Individual commit detail view** — Clicking any commit in the commit history sidebar now opens a dedicated page at `/commit/:hash` with full commit metadata (hash, author, date, message, parent links), a file list with git status indicators (A/D/M/R) and change counts, unified/split diff rendering with syntax highlighting, and session-aware view-only comment threads. The back button returns to the originating branch comparison or dashboard, preserving context.
- **Markdown preview in full-file view** — When a `.md`, `.mdx`, or `.markdown` file is open in full-file mode, a **Preview** checkbox appears in the toolbar. Checking it renders both the old and new versions as formatted markdown side-by-side — useful for reviewing documentation without reading raw markup. Comments are hidden in preview mode.

### Improved

- **`branchdiff update` — reliable package manager detection** — The update command now resolves symlinks (`realpathSync`) to find the actual package manager store path, explicitly queries `pnpm list -g` to verify ownership when path checks fail, and shows full installation context (detected PM, binary path, update command) upfront before any version check. On failure, it lists all alternative update commands and the `--pm` override flag.
- **`branchdiff info` — installation section** — The info command now shows the detected package manager, binary path, resolved symlink target, and update command in a new **Installation** section.
- **AI review skill — constructive tone** — The review skill now includes tone guidelines: collaborative language, acknowledging good code, explaining reasoning rather than prescribing fixes, and leading with the problem instead of judgments.
- **AI review skill — nth-time review awareness** — Reviews now check resolved and dismissed threads before analyzing. Previously resolved issues are not re-raised. Dismissals are only challenged if new evidence contradicts the dismissal reason. Prior fixes are acknowledged in the summary.

### Fixed

- **Bitbucket PR creation no longer fails when author is a default reviewer** — When the PR author was configured as a default reviewer in the Bitbucket repository settings, PR creation failed with a 400 error. The fix fetches the authenticated user's UUID from Bitbucket's `/user` endpoint and filters them out of the default reviewers list before creating the PR.
- **Full-file view now loads unstaged new files** — Files present only in the working tree (new, unstaged) showed blank content when opened in full-file view. The fix passes the correct `layer='working'` to the API, matching how unified/split diff modes handle working-tree files.
- **Inline comments no longer appear in multiple places simultaneously** — Comments on code ranges were sometimes displayed in both the orphaned-threads section and counted as inline-anchored threads at the same time. The fix aligns the anchor check and render position to use `endLine` consistently, matching how hunk diffs position threads.

---

## [1.4.2] - 2026-05-07

### Fixed

- **File section sort now matches sidebar tree order** — Files in the diff view are now sorted with directories before files at each path level, then alphabetically within each group. Previously the diff view used a flat `localeCompare` on full paths, which caused a mismatch (e.g., `release-notes/v1.4.2.md` appeared after `README.md` in the diff view while the sidebar correctly placed the `release-notes/` directory before root-level files).

### Improved

- **`branchdiff update` now supports all installation methods** — The update command detects npm, pnpm, yarn, Homebrew, pip/uv/pipx, Scoop, apt, and standalone binaries. Previously only npm/pnpm/yarn/brew were detected. Each method runs the correct native update command (`brew upgrade`, `scoop update`, `apt install --only-upgrade`, `pip install --upgrade`, etc.). Standalone binaries are updated by downloading the latest release from GitHub directly.
- **New `--pm` values** — `branchdiff update --pm` now accepts `pip`, `scoop`, `apt`, and `binary` in addition to the existing `npm`, `pnpm`, `yarn`, `brew`.

### Changed

- **`--earlier-commit` replaced by `--previous [n]` / `-p [n]`** — The boolean `--earlier-commit` flag is now `--previous` (short: `-p`) with an optional depth parameter. `branchdiff -p` (default N=1) compares against the parent commit; `branchdiff -p 3` compares against the 3rd previous commit. Supports an optional source ref: `branchdiff -p 5 feature` → `feature~5 vs feature`. The old `--earlier-commit` flag is removed.

---

## [1.4.1] - 2026-05-06

### Improved

- **Full file mode — copy button for each pane** — In the split view of the full file comparison, a copy icon now appears in the header of the old (changed) and new sides. Clicking copies the full content of that pane to the clipboard.

### Fixed

- **Bitbucket PR creation now includes default reviewers** — When opening a pull request from the branchdiff UI, Bitbucket's configured default reviewers are now automatically fetched and included in the request. Previously they were silently omitted. GitHub is unaffected (`gh pr create` delegates reviewer assignment to the server).
- **npm install on Node 18 no longer fails** — `npm install -g @encryptioner/branchdiff` on Node 18 was immediately failing because `scripts/postinstall.js` was missing from the published package. The `files` field in `package.json` now explicitly includes it.
- **APT repository — GPG key signature verified correctly** — `apt update` was failing with `NO_PUBKEY 8AFCC29C5DD7C18F` because the ASCII-armored public key was being written directly to `/etc/apt/keyrings/` without dearmoring. Install instructions now pipe through `gpg --dearmor` to produce the binary format apt expects.

---

## [1.4.0] - 2026-05-05

### Added

**PR Creation from UI:**
- **Create pull requests from branchdiff** — When no PR exists for a branch comparison, an "Open a Pull Request" button appears in the toolbar platform pill. Supports both GitHub (via `gh` CLI) and Bitbucket (via API token). Title is auto-generated from branch names, with editable title and description fields. Modal includes keyboard shortcut (⌘+Enter to create).

**Distribution & Platform Support:**
- **Cross-platform binary build pipeline** — `branchdiff` now compiles to 5 standalone binaries (macOS arm64/x64, Linux x64/arm64, Windows x64) using `@yao-pkg/pkg`. Each tag push triggers `.github/workflows/build-binaries.yml`, which builds in parallel on native runners and generates SHA256 checksums. Binary artifacts are available in workflow runs.
- **Binary smoke testing in CI** — Every PR runs a binary build smoke test to catch packaging regressions early.

**State Persistence & UI:**
- **UI state persistence across ports and machines** — Collapse state, reviewed file markers, and filter preferences now persist via a new SQLite `ui_state` table. Repo fingerprinting ensures the same UI state follows you across localhost ports and machines (via export/import).
- **Repo fingerprint (canonical repo ID)** — Scans git remotes (upstream > origin > first) to generate a stable repo identifier that converges across forks and machines. Falls back to `local:<hash>` for repos with no remotes.
- **Viewed file state** — Click the eye icon to mark files as reviewed; visible in the sidebar badge (`👁 N`). Persists automatically.
- **Working tree toggle** — New toolbar button to switch between staged and unstaged changes when reviewing uncommitted work.
- **File state reload** — When you switch branches, the file list automatically refreshes without losing your scroll position.

**Sidebar Filtering & Organization:**
- **Multi-filter sidebar badges** — Filter the file list by state: Commented, Uncommented, Viewed, Unviewed, Stale (viewed but file changed), Collapsed, Expanded, Staged, Unstaged. Badges stack with the search box and auto-hide when inapplicable. One-click clear button.
- **File status indicators** — File rows show inline badges: **S** (staged), **U** (unstaged), amber dot (stale — file changed since marked viewed), checkmark (viewed).
- **Stale viewed detection** — Files marked as viewed are automatically flagged stale when their content changes (FNV-1a hash comparison). Filter by "Stale" to re-review changed files.
- **Collapse state persistence per diff** — Collapse state now persists per (branch_pair + view_mode), so toggling between split/unified views remembers which files you've minimized.

**CLI:**
- **`--earlier-commit` flag** — compare a branch against its parent commit. `branchdiff --earlier-commit` compares current branch vs `HEAD~1`; `branchdiff --earlier-commit feat` compares `feat` vs `feat~1`. Cannot combine with `--base`/`--compare`.

**Performance:**
- **Non-blocking git operations** — 7 new async git helpers (`getRepoRootAsync`, `getCurrentBranchAsync`, `getRepoInfoAsync`, etc.) eliminate UI freezes on large repos. Sync versions retained for CLI.
- **Hot API routes now async** — 11 routes are updated to no longer block the event loop.
- **Parallelized ref validation** — Git ref validation across multiple calls now runs in parallel via `Promise.all`.

### Improved
- **Dependency bundling for binaries** — The ESM `open` module and other pure-JS dependencies are now bundled directly into the CLI distribution, making binaries fully self-contained. `better-sqlite3` native module is shipped as prebuilt assets.
- **Export/import bundle format (v2)** — Now includes full UI state; uiState merges during import using last-write-wins conflict resolution based on `updated_at` timestamp.
- **Tooltips (Tip component rewrite)** — Tooltips now render via `createPortal` (no longer clipped by overflow containers), auto-flip above/below based on viewport space, clamp to viewport edges, and dismiss on scroll/resize. It is now shown in most of the place instead of native tooltip. Zero-delay hover still preserved.
- **Copy Path in File and Folder Context Menu** — Updated the context menu in file section to copy the file path.

**Multiple sessions per repo:**
- **Run several comparisons in the same repo at once** — each unique ref pair gets its own session on a separate port. Handy for reviewing a teammate's PR branch while also keeping an eye on your own work-in-progress diff. Same ref pair still reuses the existing session as before.
- **`branchdiff open` now handles multiple sessions** — if more than one session is running for the current repo, it shows a numbered list so you can pick which to reopen in the browser.

### New Commands & Flags
- **`branchdiff info`** — Show current repo fingerprint, name, and state table size.
- **`branchdiff state reset`** — Clear all UI state (collapse, viewed markers) for the current repo without affecting sessions or comments.
- **`--earlier-commit`** flag — compare a branch against its parent commit. `branchdiff --earlier-commit` compares the current branch against `HEAD~1`; `branchdiff --earlier-commit feature` compares `feature` against `feature~1`. Cannot be combined with `--base`/`--compare`.

---

## [1.3.2] - 2026-04-30

### Fixed
- **Bitbucket PR handling no longer checks out branches** — opening a Bitbucket PR URL now fetches the source and destination refs without modifying your working tree. Previously, `checkoutPr` would run `git checkout` and create local tracking branches, leaving the repo on a different branch. The new `fetchPrBranch` only runs `git fetch`, which is sufficient since the diff viewer compares remote refs server-side. Cross-repo PRs (forks) still add a temporary remote and fetch from it.
- **`branchdiff review import -` no longer leaks stdin listeners** — reading from stdin now properly removes `data` and `end` listeners after the stream closes, preventing memory leaks in long-running processes.

---

## [1.3.1] - 2026-04-29

### Added
- **`branchdiff version`** — print the installed version. `--check` queries the npm registry and reports if an update is available.
- **Comments in full file view** — click any line number in the full file comparison to add, view, or edit comment threads. A "Comment" button in the toolbar lets you add file-level comments.
- **Scroll markers in full view** — a thin minimap strip alongside the scroll area shows old/new (red/green) status markers, so you can jump to changes instantly without scrolling in both `Split` and `Unified` view. 
- **Markdown preview in comments** — the comment editor and inline edit mode now include a Write/Preview toggle. Preview renders markdown including code blocks, links, and formatting before you post or save.
- **Right-click context menu on files and folders** — right-click any folder to View All / Unview All files, or Expand All / Collapse All diffs. Right-click individual files to View / Unview or Expand / Collapse their diffs.
- **Full file view keyboard shortcut** — press `f` to switch to the full file view.

### Improved
- **`branchdiff update` auto-detects package manager** — instead of hardcoding `npm install -g`, the command now detects whether branchdiff was installed via Homebrew, pnpm, yarn, or npm and shows the correct update command. Supports `--pm <pm>` flag to override detection.
- **Comment thread width in full file view** — comment threads in the full file comparison modal now respect the viewport width constraint to show the comment without horizontal scroll

### Fixed
- **Hunk navigation keyboard shortcuts** — the `n` (next hunk) and `p` (previous hunk) shortcuts now reliably jump between changed sections. Fixed DOM selector that was incorrectly matching non-hunk rows, causing navigation to skip or select wrong locations.

---

## [1.3.0] - 2026-04-27

### Added
- **Export session data** — `branchdiff export` writes all review sessions (threads, comments, and tours) to a portable JSON file. Use `--sessions` to pick specific sessions, `--all` for everything, and `--output` to name the file. Export filenames include the repo name and a Windows-safe timestamp (e.g. `branchdiff-export-myrepo-2026-04-26_18-25-21.json`).
- **Import session data** — `branchdiff import <file>` reads a previously exported file back into the local database. Three conflict strategies: `merge` (default — newer timestamp wins), `skip` (keep existing), `overwrite` (replace with imported). `--dry-run` shows what would change without writing anything.
- **Export/Import in the UI** — the 3-dot menu on both the diff view and the file browser includes Export and Import options. The import modal shows a pre-import repo-mismatch warning if the file came from a different repository.
- **Bitbucket PR checkout via CLI** — `branchdiff https://bitbucket.org/workspace/repo/pull-requests/123` now works alongside GitHub PR URLs. Automatically detects the base branch, handles cross-repo PRs (forks), and displays the source and destination branches in the terminal for clarity.

### Improved
- **Dark mode color contrast** — amber and green text in merge-conflict banner, toolbar, and import modal now use lighter shades in dark mode for better readability.
- **Consistent styling** — warning backgrounds in export/import dialogs now use a unified color pattern.
- **Instant CSS tooltips** — toolbar items (Swap, Behind counter) now display tooltips on hover via a new `Tip` component. Tooltips appear smoothly with zero delay and intelligently position above or below based on context.

### Fixed
- Running branchdiff in a non-git directory no longer pollutes the terminal with raw git error output — errors are handled silently at the server level, including the file browser and fingerprint routes.
- The "Browse files" option in the 3-dot menu is hidden when branchdiff is running outside a git repository.
- The file browser (`branchdiff tree`) and tour routes now show a friendly "No git repository found" page instead of crashing when opened outside a git working tree.

---

## [1.2.1] - 2026-04-26

### Added
- **Tours toolbar button** — a compass icon in the diff view toolbar lists all ready code tours for the current session. Click any tour to open it in a new tab with a Back button to return.
- **Tour discovery from the diff view** — no need to know a tour ID or type a URL manually. Badge count shows how many ready tours exist.
- **"How to create a tour" link** — the tours dropdown includes a link to the relevant guideline section even when no tours exist yet.
- **"Browse files" in tours dropdown and 3-dot menu** — jump to the file browser from any page in one click (tours popup footer and every route's options menu).
- **Dynamic browser tab titles** — the page title now reflects the current view: `filename — branchdiff` in the file browser, `topic — Tour — branchdiff` in a tour, `branchdiff — Guideline` / `branchdiff — Changelog` on those pages.
- **Back button on file browser when opened via app** — opening the file browser from another page (e.g. from the tours dropdown or 3-dot menu) now shows a Back button in the header, consistent with how guideline and changelog behave.

### Improved
- GUIDELINE.md is now the single source of truth for the in-app guide — no duplication between the browser page and the CLI output.
- CHANGELOG.md is similarly unified — the in-app changelog page reads from this file directly.
- Added Shell Completion section to the guide: full docs for `branchdiff completion install/zsh/bash`, branch autocomplete, and manual setup.
- Added Code Tours section to the guide: `tour-start / tour-step / tour-done` workflow, viewing from the toolbar, and AI tour prompt.
- `branchdiff clear` added to the Instance Management section of the guide.
- Toolbar merge-conflict banner and reviewed-file indicator now use consistent accent colors.

---

## [1.2.0] - 2026-04-25

### Added
- GitHub PR sync — push and pull review comment threads between branchdiff and your GitHub PR.
- Bitbucket PR sync — push and pull review comment threads between branchdiff and your Bitbucket PR.
- Scrollable thread list in PR sync dialogs — see all files with comment counts, including reply chains.
- Sync result shown inline after push/pull — clearly shows new vs already-synced threads.
- `branchdiff guide` — open the user guide in a browser without a git repository.
- `branchdiff changelog` — view release notes in a browser without a git repository.
- Changelog accessible from the diff viewer's 3-dot menu.
- `branchdiff review context --refs <refs>` — generate AI review context for any branch comparison without starting a session first.
- `branchdiff clear` — stop the running instance for the current repo and delete its stored review data.

### Fixed
- PR comment push now correctly distinguishes new threads from threads already synced to the PR.
- Reply chains preserved when pushing to and pulling from GitHub and Bitbucket PRs.

---

## [1.1.0] - 2026-04-22

### Added
- AI review commands (`branchdiff review`) — generate diff context for any AI assistant, post AI review comments, and resolve threads without a browser.
  - `branchdiff review context` — export the diff as markdown or JSON.
  - `branchdiff review threads` — export open threads for an AI resolve pass.
  - `branchdiff review import` — apply AI-generated review JSON (post comments, resolve/dismiss threads).
  - `branchdiff review run` — pipe the diff through an AI CLI in one step.
  - `branchdiff skill add` — generate Claude Code skill files for one-command review and resolve.
- Bitbucket Cloud integration — connect branchdiff to Bitbucket PRs to view and sync comments.

---

## [1.0.3] - 2026-04-22

### Added
- View/unview and expand/collapse all files in the diff viewer.
- Swap button (↔) to reverse which branch is on the left and right.
- Staged changes shown in branch comparison mode.

---

## [1.0.2] - 2026-04-21

### Fixed
- Restored compatibility with Node 18.
- Server no longer hangs when the device sleeps or shuts down.
- Server now only accepts connections from localhost.

---

## [1.0.1] - 2026-04-20

### Fixed
- Stability improvements after the initial release.

---

## [1.0.0] - 2026-04-18

### Added
- Initial release.
- Browser-based diff viewer with split and unified views, syntax highlighting, and Mermaid diagrams.
- Branch comparison: `branchdiff main feature` — see what changed between any two refs.
- GitHub PR checkout via URL (`branchdiff https://github.com/owner/repo/pull/123`).
- Inline code review — create, reply to, resolve, and dismiss comment threads.
- Dark and light themes with automatic system detection.
- Shell tab-completion for bash and zsh — branch names, subcommands, and flags all complete on `<Tab>`.
  - `branchdiff completion install` — auto-detects your shell and writes the completion script.
  - `branchdiff completion zsh` / `bash` — print the raw script for manual sourcing.
  - Branch completions come from `git branch -a` at call time, so remote refs appear once fetched.
- Code tours — `branchdiff agent tour-start / tour-step / tour-done` creates step-by-step guided walkthroughs visible in the browser Tours panel.
- Commands: `list`, `kill`, `prune`, `open`, `doctor`, `update`, `tree`, `clear`, `completion`.