<!-- AUTO-GENERATED - DO NOT EDIT IN THIS REPO. Source of truth: private repo. Edits here will be overwritten on the next release. -->

# Changelog

All notable changes to `branchdiff` are documented here.

---

## [2.0.0] -2026-08-10

### Added

- **`branchdiff auto` — review your open PRs automatically** — finds open pull requests on GitHub and Bitbucket, works out which ones have new commits since their last review, and runs your AI reviewer on them. Filter by branch with `--source`/`--dest`, keep it running with `--watch`.
- **`auto` covers every repo you work on** — run it from a directory that isn't a repo and it reviews the git repos directly under it, or name them with `--repo-paths ~/work/api,../web` (comma-separated, repeatable, absolute/relative/`~`). All repos are scanned together (`--repo-concurrency`, default 4 at a time), their PRs are listed in one combined, per-repo-grouped list you pick from once, and reviews run repo by repo. Every other flag works per repo exactly as it does in one. Because a parent directory can hold repos you weren't thinking about, `auto` asks once before reviewing discovered repos unattended or archiving their comments with `--fresh` — naming them with `--repo-paths` skips the prompt. `--keep-servers <n|all>` caps how many session servers each cycle leaves behind (default 4 across repos, everything in a single repo), retiring the oldest only once every review in the cycle has finished. Under `--watch`, a repo cloned into the parent joins the next cycle. Exit codes tell a script what happened: `0` clean, `1` nothing attempted, `2` something was skipped or failed.
- **Every pass ends with a report** — after each cycle that reviewed something, `auto` prints what it did: each PR grouped under its repo (with that repo's path), its outcome, its PR link, and its local session link marked running or stopped. A stopped session is reopened with `branchdiff <pr-url>` — your comments and threads outlive the server.
- **You stay in control of `auto`** — matching PRs are listed once so you can pick which to review (comma-separated numbers, ranges like `1-5`, `a` for all, `q` to quit); `--review` skips the prompt, `--notify` sends a desktop notification when a review starts, finishes, or fails, and `--push` is the only way comments reach the remote PR. In a non-interactive shell without `--review`, `auto` refuses rather than reviewing unattended.
- **When a toast doesn't appear, you can find out why** — `branchdiff doctor --notify` names the backend your platform uses, fires a test notification, and tells you what to check on your OS if nothing shows up (each OS can accept a notification and then quietly decline to display it). `BRANCHDIFF_NOTIFY_DEBUG=1` on any command prints what was attempted. On macOS a toast is attributed to the app that requested it and permission is granted per app, so `doctor` names that app: `terminal-notifier` when installed (its own entry in System Settings, and the only way to get click-to-open), otherwise Script Editor — which on some machines never appears in System Settings at all, in which case installing `terminal-notifier` is the fix. `BRANCHDIFF_MAC_NOTIFIER=0` forces the built-in path.
- **Notifications link straight to the PR** — with `--notify`, each desktop toast carries a link to the PR (or the local session view, for a review that finished without pushing its comments) and opens it in your browser on click wherever your OS supports it. Where click isn't supported the link is shown in the toast and the terminal, so it's still one click away — and the toast never blocks or hangs the review loop, even if you Ctrl-C `auto`.
- **`review run --notify`** — desktop notifications for a review's lifecycle: a toast when it starts, finishes, has comments pushed, sets a verdict, or fails. Default off.
- **Review and resolve skills `--notify`** — running `/branchdiff-review --notify` or `/branchdiff-resolve --notify` in a chat fires desktop toasts when the pass starts and completes (via a new `branchdiff agent notify` command). Default off; self-suppresses under `auto`, which fires its own toasts.
- **Review several PRs at once** — `--parallel <n>` reviews up to `n` of your selected PRs concurrently instead of one at a time. Requires `--worktree`, so each PR gets its own isolated checkout.
- **`--no-skip` re-opens already-reviewed PRs** — normally `auto` skips a PR once it's been reviewed at its current commit. `--no-skip` makes every matching PR eligible again — the escape hatch for a review that finished but posted nothing (e.g. the AI was blocked and exited cleanly), which would otherwise leave the PR marked reviewed. A successful re-review re-stamps the commit and normal skipping resumes.
- **Skip PRs by size** — `--max-files`, `--min-files`, `--max-lines` and `--min-lines` tell `auto` which PRs are worth a review pass: send the 900-file dependency bump to a human, and don't spend a pass on a one-word typo fix. The bounds are optional, compose (`--max-files 200 --max-lines 4000`), inclusive, and measure the whole PR against its base — so a PR over the bound stays skipped as it grows. Every skip names the flag that rejected it and by how much, and it's free: the size comes from the PR listing where your forge provides it, otherwise from one local `git diff`, and only for the PRs that were about to be reviewed anyway. A PR whose size can't be determined is reviewed rather than dropped.
- **`--skip-author` skips your own PRs** — `auto` drops any matching PR you opened yourself (matched by the authenticated user — your GitHub login or Bitbucket uuid) before it reaches the candidate list, so it never offers to review your own work. Best-effort: a PR whose author can't be determined is kept, and if your identity can't be resolved nothing is skipped.
- **Works with any AI CLI** — `--tool claude|opencode|codex|gemini|cursor|llm` picks a known one, `--exec "<command>"` runs anything that reads a prompt on stdin and prints review JSON.
- **`branchdiff history`** — browse commits from the start of the repo up to any ref or range, with search and a merge-commit toggle. Shows the total commit count (and merge count next to the toggle), and a **Load all** button pages in the rest of the list at once. Hover a commit to copy its hash or open its detail page in a new tab — even one with an enormous diff opens cleanly, showing a concise "too large to display" notice instead of trying to render the full patch. The list scales to any repo size — past a few hundred loaded commits it virtualizes automatically, so **Load all** stays smooth instead of straining the tab.
- **`branchdiff show <ref>`** — browse the whole repository as it looked at a commit, tag, or branch: the sidebar file tree, folder view, and file content all reflect that ref consistently. Your working tree stays the default view, untracked files included, and the browser scales to very large trees without failing.
- **Per-file history in the file browser** — open a file and press **History** to see its own commit log, following renames. The full-file compare view has the same **History** button, opening the file browser to that file with history already open in a new tab.
- **`branchdiff branches`** — browse every local and remote branch and tag in one view, with last-commit times and tracking info, a search box to filter by name, and an All/Local/Remote toggle to narrow the branches list; click one to open its history, or hover to copy its name or open it in a new tab.
- **Back to top** — history, branches, search, changelog, the user guide, the stats dashboard, and the diff view all show a floating button once you've scrolled down, jumping back to the top of the list in one click.
- **Stats splits your activity from the whole PR** — the dashboard defaults to **My activity**, counting only your own review work: branchdiff's automated comments and verdicts, plus your manual comments, approves, and request-changes (whether done in branchdiff or directly on the PR, which branchdiff re-reads on its next pull). Teammates and other bots are excluded. Switch to **Whole PR** to see everyone. The toggle drives the comment/thread/reply tiles, the verdict pie, severity counts, and the comments time series, in every section; reviews, lines, files, and passes are always yours. **What's stats?** opens a scrollable explanation of every dashboard section plus a glossary defining each class. branchdiff's verdict is approve or request-changes only, so My activity's pie has no "Commented" slice — that appears only under Whole PR, for teammates' commented reviews. `branchdiff stats --share`/`--no-open` gained a **Your activity** block above the totals.
- **Stats shows who resolved a thread** — the Resolved chart splits into **You** (a Resolve/Dismiss click), **Resolve skill** (the resolve skill, `review import`, or `review run`), **Platform** (resolved directly on GitHub/Bitbucket — can be a teammate), and **Other (pre-tracking)** for threads resolved before this existed. Always whole-repo, independent of the My activity / Whole PR toggle. Every KPI tile carries a hover tooltip explaining exactly what it counts; the Reviews tile's tooltip breaks down branch-pair vs snapshot (no-PR local ref comparison), so local-only reviews are accounted for too.
- **`branchdiff search <query>`** — run a `git grep` across tracked files from the CLI or the in-app Search view, grouped by file with literal/regex and case-sensitivity options. Scope it to a ref with `--ref` (e.g. the PR head); add `--json` to print the results as JSON to stdout for scripts and AI agents instead of opening the browser.
- **`branchdiff pr info --json`** — PR details (state, draft, reviewers, head SHA, URL) as JSON, for scripts and AI agents deciding whether to approve or merge.
- **Blame view** — open a file in the browser and press **Blame** to see each line's commit, author, and message grouped into hunks. The list is virtualized, so files of any size blame smoothly with no line cap.
- **Commit graph** — toggle a full-DAG graph beside the history list: continuous colored lanes, merge curves, clickable nodes (jump to the commit), hover tooltips, and a legend explaining the symbols. The **Merges** and **Graph** toggles compose correctly together, whichever order you switch them on.
- **Consistent cross-page navigation** — every view (history, branches, search, files) shares the same icon nav in its header, so you can jump between them from anywhere; the diff view's commit list has a one-click history link for the compared branch. The header's **Back** button always does something sensible, even in a tab with nowhere in-app to go back to.
- **Selectable commit hashes** — the short hash in the history list is now plain text you can select and copy; the row still clicks through to commit detail.
- **Ref suggestions on typos** — mistype a ref in `history` or `show` and branchdiff prints the closest branch/tag matches instead of a bare error.
- **Review without touching your working tree** — `--worktree` checks a PR (GitHub or Bitbucket) or a review target out into `.worktrees/` instead of switching your branch. The worktree is kept afterwards so you can keep working in it; `--worktree-remove` cleans it up instead, and even then a worktree holding untracked or modified files is kept and reported rather than deleted. `branchdiff auto --worktree` accepts the same `--worktree-remove`, forwarded to each PR's review run. For a `--worktree` PR session (which stays running until you stop it), clean up its checkout with `branchdiff kill`/`killall --worktree-remove` instead.
- **Fresh, unbiased reviews** — `branchdiff review run --fresh` archives existing comments first so old drafts don't steer the AI. Archived comments are preserved, not deleted.
- **Approve with comments** — the approve dialog can post your pending review comments along with the approval, on both GitHub and Bitbucket.
- **`--sync` on resolve** — `branchdiff agent resolve|dismiss --sync` also resolves the thread on the remote PR. Without it, resolving stays local, as before.
- **Name the session you mean** — every `agent` and `review` command now takes `--session <id>` or `--port <n>`, and `BRANCHDIFF_SESSION_ID` pins a whole shell to one session. With a single session open nothing changes; with several, branchdiff lists them and lets you pick instead of choosing for you. Threads are scoped per branch pair, so `agent list` with none to show names the pair and session it checked and how to target another.
- **`branchdiff list current` and `branchdiff killall current`** — show, or stop, only the sessions belonging to the repo you're in instead of every session on the machine. Outside a repo they report that there's nothing here rather than failing, so they're safe to drop into a script.
- **Install skills where you want them** — `branchdiff skill add --target` puts the review and resolve skills in this repo, in your home directory for every repo, or in opencode's own directories; pass a comma-separated list for several at once, or `--dir <path>` for an exact location. The default still installs into the current repo, and because opencode also reads `.claude/skills`, one install covers both tools.
- **`branchdiff auto --skill`** — drive an actual review skill instead of the context+JSON pipe: the AI follows the skill's instructions directly and posts its own comments, nothing to import. `--skill` uses the built-in "branchdiff" skill without installing anything anywhere (its instructions ship inside this package); `--skill-name <name>` uses a custom skill you've already installed with `branchdiff skill add`; `--additional-skill <name>` (repeatable) folds another installed skill's guidance into that same pass instead of running it separately — handy when a specialised skill (e.g. security-focused) doesn't know branchdiff's own comment/resolve commands. The classic context+JSON pipe stays the default, so nothing changes unless one of these flags is passed. `--prompt <text>` adds one-off instructions on top, in either mode.
- **`branchdiff auto --resolve`** — add a resolve pass after (or instead of) the review pass: the AI reads the session's open threads, fixes the code, and resolves them, local only (no commit, no push). Works standalone — no `--skill` needed — resolving whatever's already open. `--resolve-skill-name`/`--additional-resolve-skill`/`--resolve-prompt` mirror the review-side flags for the resolve pass. With `--worktree`, both passes share the one throwaway checkout, removed once at the end (still refuses to remove it if resolve left it dirty).
- **`branchdiff auto --approve [level]` / `--request-changes [level]`** — decide whether a PR should be approved or have changes requested, and always post a verdict comment explaining the decision — created as a normal comment on the session, showing up locally as well as on the remote PR once pushed. Actually setting the PR's verdict on GitHub/Bitbucket additionally requires `--push` — without it, the reasoning stays local commentary only, and branchdiff never touches the remote review state. An optional level (1-5, default 1) sets how strict the gate is: 1 blocks only `[must-fix]`, each step up also blocks the next severity tag (`suggestion`, `nit`, `question`), and 5 blocks any open thread at all, tagged or not. Whichever flag is set, the other must agree on the level if both are passed — branchdiff refuses to guess between two different levels. The gate is otherwise deterministic, never the AI's own claim: any open thread at or above the chosen level blocks approval, and so does any open thread a human started at all, tagged or not. Before deciding, the AI reconciles every open thread from an earlier pass against the new diff — resolving its own prior findings directly, but only ever replying with a suggestion (never resolving) to a human's, since resolving is always the commenter's own call — so a reviewed-then-updated-then-re-reviewed PR converges correctly without the tool closing someone else's discussion for them. Whichever side isn't enabled gets a written recommendation in the verdict comment instead of silence.
- **Every posted comment shows its file:line and review commit** — inline comments carry a "`file:line` · reviewed at `<sha>`" footer; general/summary comments carry the commit plus a `file:line` list of the inline findings in the same batch, so an un-anchored summary still points at exactly what it's about. Shown consistently in the local UI and on the pushed remote PR comment alike. Because that footer's commit changes on every push, `sync push` recognizes an already-posted comment by its remote id first (falling back to matching by content when no id has been captured yet), so re-pushing after the PR picks up new commits never reposts what's already there.
- **Both generated skills accept `instructions`** — `/branchdiff-review`/`/branchdiff-resolve` (and any custom-named skill from `skill add`) now take a free-form extra-guidance argument, e.g. "skip files under ai/", applied alongside the normal workflow rather than replacing it.
- **See where a `--worktree` session lives** — `branchdiff list` prints the worktree path for any session started with `--worktree`, and the browser toolbar shows the same as a small badge next to the branch name (hover for the full path).
- **One `branchdiff auto` per repo** — a second `auto` in the same repo is now refused instead of running alongside and duplicating work; pass `--force-session` to allow it. Different repos are unaffected.
- **One general comment per review pass** — a single `review run`/skill pass consolidates every general remark, the summary, and the deterministic verdict into one general comment body (sections separated by `---`), so a pass reads as one block and pushes to the PR as a single comment (one Slack/Bitbucket notification per pass). Separate passes are separate; general comments pulled from the PR are separate too, matching the remote. Inline findings stay on their own `file:line`.
- **`branchdiff agent refresh`** — pulls the latest PR comments and refuses to review if the local branch is behind the PR head, so a review runs against fresh code rather than a revision the PR has moved past. The review skill runs it before reading the diff, giving a standalone skill review the same pull-and-stale-guard `review run`/`context`/`import` apply. Pass `--allow-stale` to review the local revision regardless.
- **`review run` gives a deterministic verdict, and can push like `auto`** — every `review run`/skill pass ends with a deterministic approve/request-changes recommendation — derived from open `[must-fix]` and human-authored threads, never the AI's call — posted as a general comment, so a single run behaves like `auto` minus the push. Pass `--push` (with `--approve`/`--request-changes`) to push comments and apply the verdict to the PR too. `branchdiff review verdict` posts the same verdict on demand, and the review skill calls it as a final step (pushing only when you ask).
- **`branchdiff auto` and `review run` explain themselves before they start** — both print a run summary up front: every flag you passed ("Using:") and which default applies to everything you didn't ("Defaults in effect:"), so a command with two dozen possible flags still tells you plainly what this particular run will do. Only the lines relevant to the run show up — e.g. resolve-pass lines are omitted when `--resolve` isn't set — and an `--approve`/`--request-changes` line spells out what its severity level actually blocks (e.g. "blocks `[must-fix/suggestion]` + any open human-started thread"), not just the level number. Each summary ends with a pointer to `branchdiff guide` for the full flag reference.
- **Config file for the root command and `auto`** — stop retyping long flag sets. `~/.branchdiff/config.json` (global) and/or `.branchdiff.json` (a repo root or launch directory) supply flag defaults: a top-level `defaults` key mirrors the root command's flags (`--mode`, `--port`, `--dark`, `--unified`, ...), a top-level `auto` key mirrors every `auto` flag. A flag you actually type always wins; the folder file wins over the global one, and in a multi-repo `auto` run each repo's own `.branchdiff.json` wins over the launch directory's, which wins over global — `--repo-paths`/`--repo-concurrency`/`--keep-servers`/`--watch`/`--force-session` are launch-wide and resolve once, before any repo is scanned. `auto.exec`/`auto.tool` are the one exception, honored only from the global config or a CLI flag, never a `.branchdiff.json` — that file can arrive via `git clone`, and `exec` runs a real shell command. `branchdiff config` prints the fully-merged effective config and which file each value came from — a key nobody set anywhere still shows its actual built-in default, not just that it's unset; `branchdiff config sample` (`--global` for the global file) writes a starter file with just a handful of commonly-useful keys, refusing to touch one that already exists unless `--force` is passed — everything a sample omits keeps its built-in default, and a folder-level file only ever needs the keys that actually override something for that repo. An unrecognized key warns (naming it and the file) rather than failing; malformed JSON fails clearly, naming the file — for `auto` across many repos, a bad per-repo config skips only that repo, while a bad global or launch-directory config stops the run before it starts.
- **`branchdiff auto --detach` — run unattended on a headless server** — forks `auto` into the background: the terminal returns immediately, output goes to a session-scoped log file (`~/.branchdiff/auto-sessions/<id>.log`), and the process survives the shell/SSH session closing. Requires `--review` — an unattended background process can never answer the PR-selection prompt. `branchdiff auto list` shows every running `auto` — a foreground run in another terminal included, alongside every `--detach`/cron session (id, repo(s), pid, mode, watch interval, log path — `--json` for scripts); `branchdiff auto attach <id>` read-only tails its log (Ctrl-C stops watching, never the session); `branchdiff auto stop <id>` sends the same `SIGINT` a foreground Ctrl-C would. Sessions covering different repos (or repo sets) are fully independent — distinct id, log, and repo locks — so stopping one never touches another.
- **`--yes` skips the discovery/fresh confirmation prompts** — pre-answers them as if you'd typed "yes" yourself, for a scripted or unattended run against a discovered `--repo-paths <folder>`. Re-checked every `--watch` cycle, so a repo discovered later stays covered too.
- **`branchdiff auto cron add/list/remove` — cron-backed scheduling** — for "review PRs from 10am to 8pm on weekdays" (or any start/stop window), branchdiff manages real crontab entries directly, tagged so it only ever touches its own lines. The start entry runs a `--detach --watch` loop (`--yes` appended automatically) that re-resolves `--repo-paths` **live** every cycle, so a repo cloned in later is picked up with no re-`add`; the end entry stops it (a silent no-op if it never fired or already crashed). Naming repos explicitly shows no prompt; naming a folder shows a one-time standing-trust prompt first, spelling out that any repo added to it *in the future* is covered too — declining leaves the crontab untouched. `auto stop --cron-id <cronId>` stops a schedule's live session directly. `auto cron list` shows each schedule's live status (`running`/`waiting`/`idle`) plus its next and last start/end fire times, computed from the cron expressions themselves — no waiting for a schedule to fire to confirm it's alive; `--json` carries the same fields. Refuses cleanly without `--review` or on a platform with no `crontab` binary; warns (doesn't block) if the `cron`/`crond` daemon doesn't appear to be running. Unix only. Need more than one window a day (11am–1pm *and* 3pm–6pm)? Run `auto cron add` once per window — each is its own tagged start/stop pair, started and stopped independently; overlapping windows defer to the per-repo lock instead of double-running.
- **Running your own PR-review bot** — the user guide walks through assembling a self-hosted, always-on review bot (a dedicated GitHub/Bitbucket account, a scoped token, a server, and `auto cron add`) from the pieces above — branchdiff's alternative to a hosted bot like CodeRabbit.
- **`--detach`/`--yes` are config-file-settable too** — join the other launch-wide `auto` keys in `.branchdiff.json`/global config, resolved the same way as `--watch`/`--repo-paths`. `yes` is launch-dir/global only, never per-repo, so a discovered repo's own config can't self-approve its own inclusion.
- **`branchdiff stats` — see how much branchdiff has helped, across every repo you use it in** — reviews run, comments posted, verdict breakdown (drawn from branchdiff's own review verdict, so it fills in on Bitbucket as well as GitHub), resolution/approval rate, lines and files reviewed, a per-repo bar chart and table (each row summarized as times reviewed / PRs / approved / changes-requested / suggestions), and a per-PR breakdown (accurate pass count — every re-review of the same PR counts, not just its first — verdict, severity-tagged comment counts, resolved-thread fraction, each PR number linking out to its forge) — comment bodies and PR descriptions never leave your machine, counts only. The all-repo aggregate needs no git repo to compute, so `branchdiff stats` works from any directory, not just inside one; `--repo` and the dashboard's "This repo" scope toggle need an actual repo to narrow to, so they're only available (and the toggle only shown) when you're standing inside one. Reachable three ways: `branchdiff stats` auto-opens the `/stats` dashboard (reusing an already-running instance for the repo if one exists), the 3-dot menu's **Stats** entry, or `--no-open`/`--json`/`--share` for scripts and AI agents. `--days`/`--since`/`--until` set the time window (default: last 30 days), mirrored by preset chips and a custom date range in the dashboard. A **Jump to** bar under the controls links straight to every section of the dashboard — Overview, Charts, Trends, Repos, PRs, Instances, Auto sessions, Cron schedules — expanding a collapsed one along the way. The dashboard's **Copy summary** and **Export PNG** produce a shareable markdown block or themed image; a **Quick commands** panel with three collapsible sections (`branchdiff list`/`auto list`/`auto cron list`) that fetch live data on expand from dedicated endpoints, grouping entries by repo — each entry has action buttons to **Kill** an instance, **Attach** to or **Stop** an auto session, or **Remove** a cron schedule, right from the dashboard, with a tooltip on every button naming its CLI equivalent.
- **Export/import round-trips completely** — a bundle exported from the browser or CLI imports cleanly through either; PR number/platform/description, files/lines reviewed, sync state, and review verdicts all survive an export → import cycle. Comments merge like threads do — an edited-on-source comment with a newer timestamp wins on import, normal day-to-day use stays append-only. Importing on a different repo remaps any imported viewed/collapse state to the destination repo, so it actually appears there. A malformed or partial bundle is reported precisely — which entity is missing what field — instead of a bare parse error.

### Changed

- **Stale viewed files re-view in one click** — clicking the eye icon on a stale file now re-signs with the current patch hash (viewed-current) instead of removing the viewed mark. Context menu shows "Re-view" for stale files.
- **Review time tracked no matter how you review** — `branchdiff list` now reflects review time for every path that produces comments: the browser UI, CLI `review run`/`import`, and the AI's own `branchdiff agent` commands (comment, reply, general-comment, resolve, dismiss). Previously an AI review — standalone via the review skill, or `auto --skill` — posted its comments straight to the database and left `list` showing a stale "reviewed … ago" from an older browser review. `branchdiff list` also now prints the absolute date/time alongside the relative age (and labels the start time), so "reviewed 2 months ago" is verifiable at a glance instead of confusing.
- **PR shown wherever a session is linked to one** — once a branch-pair session is reconciled against a GitHub/Bitbucket PR, `branchdiff list` and every startup banner tag the `repo  PORT  pid` line with `<platform> #<number>` instead of leaving it implicit, and `list` moves the started/reviewed timestamps to their own line to keep the header from growing unreadably wide.
- **Per-file additions/deletions in compare response** — `/api/compare` includes `additions`/`deletions` per file from `git diff --numstat`, enabling accurate virtualizer height estimates before hunks are lazy-loaded.
- **Improved scroll performance** — virtualizer overscan increased from 3 to 5; height estimates for unloaded files use additions+deletions as a proxy instead of a flat 100 px fallback.
- **Larger full-file compare dialog** — max width increased from 1400px to 1800px, using more screen real estate on wider displays.
- **Re-running `branchdiff skill add` updates your skills** — it used to refuse when a skill already existed, so upgrading branchdiff left you on the old version unless you passed `--force`. It now replaces what it wrote before, reports skills that are already current, and still keeps anything you wrote yourself unless you ask for it to be replaced. Skills installed before this release are backed up alongside the new file.
- **Resolving works when the fix belongs on another branch** — the resolve skill used to assume you were standing on the reviewed branch. It now checks whether the reviewed code is actually in front of it and finds each finding by its code rather than by a line number, so fixing on a branch that later merges into the reviewed one — or on a rebased successor — works the same way. A finding it can't place is reported instead of guessed at, and it says which branch a fix landed on when that isn't the reviewed one.
- **The resolve skill verifies before it claims a fix** — it runs the project's own build, typecheck or tests before marking threads resolved, and says so plainly when a project has no checks to run.
- **Compare a branch you have never checked out** — naming a branch that only exists on the remote used to fail with "not a valid git reference", even for a branch pushed by a colleague minutes earlier. branchdiff now creates it locally from the remote and sets it to track there, so it is ready for your next `git pull`. As before, `--no-sync` skips this.
- **Compared branches are brought up to date first** — branchdiff now fetches and fast-forwards the branches you're comparing before opening the diff, so a destination like `development` that you haven't checked out in weeks no longer makes you review against a stale copy. Diverged branches and anything under uncommitted changes are reported and left exactly as they are; `--no-sync` skips the step entirely.
- **Reviews read from git, not your checkout** — the AI now reads file content at the compared refs (new `branchdiff agent file <path> --ref <ref>`), so a review can't be skewed by whatever branch happens to be checked out.
- **Remote comments are pulled as soon as a PR session opens** — not just before a `review run`/`context`/`import` pass, but the moment the session is created (opening a PR URL yourself, via `branchdiff auto`, an AI agent starting one from the review skill, or simply opening a PR-linked branch comparison in the browser), so the current discussion is already there the first time anyone looks. `review context`/`run` also now include the PR description and flag any thread already resolved on the platform, so the AI doesn't re-flag settled feedback.
- **Review bodies, PR descriptions, and remote-resolved state now surface locally** — the note attached to a GitHub approve/request-changes/comment review appears in General Comments and the reviewer badge's tooltip (Bitbucket has no review-body concept at the API level, so this is GitHub-only); the PR description shows in the sync dialog; and a thread already resolved on GitHub or Bitbucket shows a **Resolved on remote** badge, distinct from branchdiff's own local resolve status.
- **`branchdiff auto --skill` shows the reviewer at work** — the AI's output now streams live as it reviews (each line tagged with its PR number so parallel runs stay readable), instead of being hidden until a silent "0 comments". You can see what it's doing and, if it stops, why.
- **Skill mode grants headless tool access for you** — in skill mode the AI runs `branchdiff agent` commands itself, which a headless CLI won't do while it's waiting for approval prompts nobody can answer. `--tool claude|gemini|opencode|codex` now adds each CLI's auto-approve flag automatically (and says so); `--tool cursor` is flagged as needing its Auto-review setting, `--tool llm` (which runs no tools) is steered to classic mode, and a spelled-out `--exec` is warned if the flag looks missing. Reviews run in an isolated `.worktrees/` checkout.
- **Told when a pick is waiting** — in a `--watch` loop without `--review`, `--notify` now also fires when a new cycle has PRs waiting for your selection, so the loop doesn't stall silently while you're away from the terminal.
- **One worktree per PR, named `pr-<n>`** — every `--worktree` review (direct URL, `auto`, or `review run`) now checks out into `.worktrees/pr-<n>` and reuses that one checkout, instead of `auto` and `review run` each creating a second worktree named after the branch.
- **The reviewed-at footer is part of the comment** — the `file:line · reviewed at <sha>` line under a finding is now part of the comment body itself (editable, identical locally and on the pushed PR), not a separate block below it. It's the context a human needs to go fix the issue by line outside branchdiff.

### Fixed

- **A missing native binding now says how to fix itself, and branchdiff checks for it before you're relying on it** — when branchdiff's SQLite module (better-sqlite3) has no working compiled binding — after a Node upgrade, or when the binding file was replaced while a server held it open (common on NTFS/FUSE mounts) — the error names the cause and the exact remedy (`branchdiff killall && npm rebuild better-sqlite3`) instead of a bare "exited with code 1", which reads as a branchdiff bug rather than an environment one. This is what causes `branchdiff auto` to report `failed … starting session` on one cycle and a misleading `done — 0 comments` on another (the AI couldn't reach the CLI to post), for the same underlying reason. `branchdiff doctor` opens a real database to check this, not just whether the module is requireable — the native addon only loads on first use, so a require-only check could report healthy right up until the first real command needs a database. `branchdiff auto cron add` runs the same check before writing anything to your crontab: a scheduled job re-runs the exact same binary forever, so a broken binding there would otherwise fail silently on every single fire with nothing but a log file to notice — it now refuses up front instead.
- **A session's address opens that session** — typing just `localhost:<port>` landed on the working-tree view instead of the comparison running there, and with several sessions open `branchdiff list` could print the wrong port for one of them. The port you reach now takes you to its own comparison.
- **Reviews no longer drift onto the wrong PR** — with two branchdiff sessions open on one repo, a review started for one PR could end up commenting on the other, and simply leaving the other PR's browser tab open was enough to trigger it. An AI review is now tied to its own session for its entire run.
- **Concurrent reviews stay isolated** — with several sessions live, commands that used to fall back to a shared "current session" now require you to name one, and the generated AI skills carry their session with every call. Two automated reviews can run side by side without reading each other's comments.
- **A new PR no longer inherits an old, closed one's comments** — branch-pair sessions are matched by branch name alone, so if a PR closed and a new one later opened for the same branch names, opening it (in the browser, via `branchdiff auto`, or `review run --url`) used to resume the old PR's session — showing its stale comments against the new PR's diff. branchdiff now notices when the PR number attached to a session changes and starts a fresh one automatically, the same as `--new`/`--fresh` but without you having to remember to run it. The old PR's comments are archived, not deleted — see them with `branchdiff session history`.
- **`branchdiff session history` works again** — the documented no-argument form always failed with "Missing b1 or b2"; it now defaults to the current branch pair. It also reported "0 threads" for every archived session regardless of content, which made archived comments look lost. Both fixed, and archived sessions can now be read back with `branchdiff review threads --session <id> --status all`.
- **Error pages no longer print the same message twice** — single-line errors (e.g. "Invalid git ref") repeated the text in the details box below.
- **PR commands work when you're not standing on the PR's branch** — `sync push`, `sync pull`, `pr info`, `pr approve`, `pr merge`, `pr comment` and the rest resolved the pull request from your *checked-out* branch. Reviewing a PR from a URL, in a worktree, or via `auto` meant they failed with "No PR found for the current branch"; they now follow the session's own branch. This is what stopped `auto --push` from ever publishing.
- **Pushed comments are remembered as pushed** — comments sent from the CLI were created on the PR but not recorded locally as synced, so they looked unpushed forever and `agent resolve --sync` had no remote thread to resolve.
- **`branchdiff pr info` shows the PR** — title, state, head, reviewers and URL were all blank on both GitHub and Bitbucket.
- **`sync push` reports what it did** — it always said "Created: 0" even when comments were posted.
- **Desktop notifications work on Windows** — the notification never appeared, and text from a PR title or branch name could be interpreted as PowerShell instead of shown. Notifications are now sent safely and are fully detached, so a system without a notifier can't stall a review.
- **`--worktree` works on shared or root-owned checkouts** — git refused to operate inside the worktree branchdiff had just created ("detected dubious ownership") for anyone relying on `safe.directory`.
- **`--worktree` reviews no longer crash on repos with git hooks** — creating the review worktree ran the repository's own `post-checkout` hook (e.g. husky), and a hook that failed there aborted the whole review with a raw error stack. These machine-driven, throwaway checkouts now run without firing hooks, and any genuine failure is reported as one clean line instead of a crash.
- **No more spurious "HEAD has moved" warning** — every `agent` command printed it when comparing two branches, telling you to restart a session that was working fine.
- **The repository name is shown, not the folder you happen to be in** — reviewing in a worktree labelled the UI, the window title and `branchdiff list` with something like `pr-2142-review` instead of the repo. The name now comes from the repository's remote (falling back to the main checkout's folder when there is no remote), so a clone living in a differently-named directory shows its real name too.
- **A worktree counts as the same repository** — `branchdiff open`, `kill --repo`, `clear` and the `review`/`agent` commands could not see a session started from the main checkout when run inside a worktree, and vice versa. Worst case, `clear` run from a worktree wiped the shared review data while leaving the other instance running.
- **`branchdiff prune` asks before deleting everything** — it wiped review data for every repo under `~/.branchdiff` with no confirmation, unlike `clear` (which only touches the current repo and already prompted). It now shows how many repos and running instances are affected and asks first, same y/N pattern as `clear`; `--force` skips the prompt for scripts and AI agents.
- **Reviews refuse to run on stale code** — when your local branch was behind the pull request, branchdiff already detected it, then threw the evidence away and reviewed the old revision anyway. It now stops and tells you to update the branch; `--allow-stale` reviews the local revision regardless.
- **A reused review worktree follows the PR** — reviewing the same PR a second time with `--worktree` left the worktree parked on the first review's commit, so the AI read old file content alongside a current diff. A worktree holding your own uncommitted files is still left untouched rather than reset.
- **`branchdiff list` shows the real review time** — every session fell back to a single per-repository marker, so a brand-new session could report a review from months ago, and rows for other repositories showed the current directory's timestamp. Sessions with no review of their own now say "no review yet".
- **`.worktrees/` no longer shows up as an untracked change** — checking a PR out with `--worktree` made your `git status` (and branchdiff's own working-tree view) look dirty, which is exactly what the option promises not to do. Your `.gitignore` is left alone.
- **`branchdiff update` tells you when the skills changed** — the check existed but compared a placeholder against itself, so it never once fired and upgrades left your installed skills quietly out of date.
- **`branchdiff review skill` installs a skill that works** — it wrote a flat `.claude/skills/branchdiff-review.md`, a layout no AI tool looks for, so the skills silently never appeared. It now writes the same `<skill-name>/SKILL.md` layout as `branchdiff skill add`, and points out the stale flat file if you have one.
- **Blank/white screen on scroll eliminated** — the virtualizer now uses per-item absolute positioning (`position: absolute` + `top: item.start` per file block) instead of a single translated wrapper. Wrong height estimates no longer displace all subsequent items, eliminating the half-screen blank gap during fast scroll in branch comparison mode. Positioning with `top` rather than `transform` keeps each file's header sticky, so the filename stays pinned at the top of the viewport as you scroll through its diff — lazy-loaded files no longer render their name below the changes.
- **Marking a file viewed scrolls to next file** — clicking the eye checkbox in the diff view now advances to the next file instead of jumping to the top of the page.
- **Collapsing a file scrolls to next file** — clicking a file header to collapse it also advances to the next file, matching the viewed-file behavior.
- **Viewed state persists across sessions** — reopening a branch comparison in a new branchdiff instance now correctly restores which files you had already marked as viewed.
- **Review commands no longer kill existing instances** — health check timeout increased from 2s to 5s with automatic retries (3 attempts, 500ms apart). Busy servers are no longer falsely marked unhealthy and killed when an AI agent spawns `branchdiff <refs> --no-open`.
- **Comment threads overflow in full-file compare** — comment threads no longer exceed the visible pane width. Uses CSS container queries (`container-type: inline-size` + `max-width: 100cqi`) to constrain comments to the code pane, while long code lines still scroll horizontally. Action buttons (resolve, collapse, delete) always remain visible with `shrink-0`.
- **Session URL missing full path** — `branchdiff review run` and `branchdiff review import` now always print the full clickable URL (e.g. `http://localhost:5391/diff?b1=main&b2=feat&mode=git`) instead of just `http://localhost:5391`. Falls back to constructing the URL from registry data when the stored URL is unavailable.
- **Last review timestamp shared across comparisons** — `branchdiff list` now shows per-comparison review times instead of one shared timestamp per repo. Review activity is stored per-ref, so each branch comparison shows when it was last reviewed independently.
- **General comments are visible when browsing the file tree** — the "General comments" panel only rendered in the branch comparison view; opening the same session from the repository file browser (`branchdiff show`, the sidebar file tree) showed a "general" count with no way to reach them, and clicking it tried to navigate to a file named `__general__`. The panel now renders there too.

---

## [1.6.1] - 2026-05-22

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