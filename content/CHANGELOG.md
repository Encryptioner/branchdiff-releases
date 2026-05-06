<!-- AUTO-GENERATED - DO NOT EDIT IN THIS REPO. Source of truth: private repo. Edits here will be overwritten on the next release. -->

# Changelog

All notable changes to `branchdiff` are documented here.

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