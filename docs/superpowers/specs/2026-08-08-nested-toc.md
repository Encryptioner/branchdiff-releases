# Nested TOC for Guideline & Changelog — Design

**Date:** 2026-08-08
**Branch:** `feat/master/v1/nested-toc`
**Status:** Approved (drawer variant)

## Problem

`guideline.html` and `changelog.html` render `content/*.md` via marked.js and build a
**flat** TOC (`buildTOC` in `scripts/shared.js`) limited to two heading levels
(`h2, h3` for guide, `h2` only for changelog) with two hard-coded indent classes.
There is no way to navigate the document's real h2–h4 (someday h5) hierarchy, and
search matches heading text only — not body content.

The upstream [`branchdiff`](https://github.com/Encryptioner/branchdiff) app ships a
better UX in `packages/ui/src/routes/guideline.tsx` + `packages/ui/src/lib/toc.ts`:
a **nested collapsible tree** over h2–h5, **fullText search** (heading + body +
descendants), **IntersectionObserver scroll-spy** with ancestor highlighting, and a
**mobile slide-in drawer**. This spec ports that behavior to this no-build static site.

Content is also stale: `content/GUIDELINE.md` and `content/CHANGELOG.md` lag
`../branchdiff/packages/cli/`. This is refreshed as part of the same change.

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Heading-level control | **Nested tree, no level filter** | Matches reference; content is h2–h4 (h1 = doc title, stripped; h5 absent). User-confirmed. |
| Changelog TOC | **Full TOC + search** (same as guide) | 19 versions is a lot to scroll. Reference omits it; user asked to improve changelog. |
| Tree source | Port `toc.ts` from **markdown** + fenced-code guard | Verbatim ~75-line port; guard stops `##` inside bash code blocks from creating ghost nodes (guide has many). |
| DOM↔tree id sync | **Positional pairing** — i-th rendered h2–h5 ← i-th tree node's `id` | DOM `id` literally copied from node; cannot drift from `slugify`. |
| Scroll-spy | **IntersectionObserver** (replaces current `scrollY`-math) | Handles many simultaneous short h4s; ancestor highlight depends on it. |
| Mobile shell | **Slide-in drawer** (faithful to reference) | Deep 4-level / ~190-heading tree needs full height; inline strip's 55vh is cramped. Trigger = existing sticky "On this page" bar (retained), opening a full-height translated panel instead of the cramped inline expand. |
| Search | fullText substring, instant, no debounce | Matches reference; doc is small enough. |
| Skipped | breadcrumb bar, back-to-top FAB, level-filter chips, persistent collapse state, search debounce/fuzzy | Not requested (ponytail). |

## Data model (ported from `toc.ts`)

```js
// TocNode
{ id, text, level, isPart, line, fullText, children: [] }
//  id       = slugify(text) with dedup suffix
//  level    = 2..5 (length of the `#` prefix)
//  isPart   = /^Part\s+\d+/i.test(text)  → special divider styling
//  line     = 0-based line index in markdown source
//  fullText = heading line + all body + descendant headings, up to next
//             heading with level <= this.level (or EOF). Precomputed → search
//             is one .includes() per node, no re-parse.
```

Helpers to port verbatim (framework-free): `slugify`, `scanHeadings` (regex
`^(#{2,5})\s+(.+)$`, **skip lines inside ``` fences**), `buildTocTree`
(stack-based level algorithm), `filterTocTree`, `findPath`, `flattenIds`,
`containsId(node, id)` (active = node or any descendant matches).

## File-by-file changes

### `scripts/shared.js` — rewrite `buildTOC`, port helpers
- Port the `toc.ts` helpers above (fence-guard added to `scanHeadings`).
- Rewrite `buildTOC(contentEl, tocEl)`:
  1. Take the **markdown source string** as a new param (or read from a module-level
     var set by each page's loader) → `buildTocTree(md)` → tree.
  2. Query rendered DOM headings `h2,h3,h4,h5` in order; **positionally pair** with
     tree nodes; stamp `el.id = node.id`. Bail (hide TOC) if counts mismatch.
  3. Render nested `<ul>` with chevrons; Part nodes get a divider class; collapsed
     nodes (`Set<id>`) skip their children.
  4. Search input → `filterTocTree(tree, q)` → re-render; clear button; no-results.
  5. IntersectionObserver spy → active id → highlight node **+ ancestors**
     (`containsId`); desktop active state only (drawer closed while reading).
  6. Click link → `scrollIntoView({behavior:'smooth'})` + `history.replaceState`;
     chevron click `stopPropagation` then toggles collapse.
  7. Intercept clicks on rendered `a[href^="#"]` → smooth scroll + replaceState.
  8. Deep-link: on load, if `location.hash`, jump after async render.
- Mobile drawer: a **translated panel** (CSS `translateX(-100%→0)`, slide-in
  keyframe — no `<dialog>`, for Safari<15.4 compat on a public site). Trigger =
  the **existing sticky "On this page" bar** (retained) — it opens the full-height
  panel instead of expanding inline. Backdrop click + section-select close it;
  body-scroll-lock while open.

### `styles/main.css`
- **Replace** flat `.toc-h2` / `.toc-h3` rules with level-based indent
  (h2 none, h3 `ml-4`+border, h4 `ml-8`, h5 `ml-12`) + shrinking font.
- Add: chevron (▶ → rotate 90° when expanded), Part-heading divider style,
  active + ancestor tint, drawer slide-in keyframe + backdrop, mobile
  "Sections" button. Keep the working `scroll-padding-top` / sticky-sidebar
  desktop layout; retune observer `rootMargin` to match sticky offsets.

### `guideline.html` / `changelog.html`
- Both call `buildTOC(contentEl, tocEl, md)` identically (h2–h5). Changelog drops
  `{selector:'h2'}` → gets full nested TOC + search. Pass the fetched `md` string
  into `buildTOC`.

### `content/GUIDELINE.md`, `content/CHANGELOG.md`
- **Wholesale copy** from `../branchdiff/packages/cli/{GUIDELINE,CHANGELOG}.md`
  (byte-identical to CI sync output — respects "don't hand-edit `content/*.md`").

### `site-index.json` (follow-up, not in this branch's code diff)
- Regenerate via `../private-chat` `build:site-index` per CLAUDE.md — the RAG index
  silently goes stale otherwise. Run if that checkout exists; else hand the user the
  command block from CLAUDE.md.

## Cross-screen correctness (explicit requirement)

- `scroll-padding-top` and observer `rootMargin` tuned so anchor jumps clear the
  56px sticky header on **all** breakpoints (360 / 768 / 1280 px).
- Mobile: drawer body-scroll-lock while open; selecting a section closes drawer and
  smooth-scrolls; backdrop dismissible.
- Long h4 runs (62 install-step headings) collapse by default → no runaway tree.
- No horizontal scroll from the tree (text-overflow ellipsis on long headings,
  matching current `.toc-link`).

## Ordered implementation steps

1. Branch (done: `feat/master/v1/nested-toc`).
2. Port `toc.ts` helpers into `scripts/shared.js` (fence-guarded `scanHeadings`).
3. Rewrite `buildTOC` to nested-tree renderer (steps 1–8 above).
4. Update `styles/main.css` (replace flat TOC CSS; add tree + drawer).
5. Update `guideline.html` + `changelog.html` call sites (pass `md`, drop selector).
6. Sync `content/*.md` from upstream.
7. Local smoke test (both pages, 3 breakpoints) — see below.
8. (Follow-up) regenerate `site-index.json`.

## Smoke test (manual)

- Tree renders h2–h4; Part nodes styled as dividers.
- Search "bitbucket" (or any body-only term) → matches the right h4 via fullText.
- Collapse/expand chevrons; chevron click does not scroll.
- Scroll → active node + all ancestors highlighted; works at 360/768/1280 px.
- Mobile drawer: opens via button, backdrop + select close it, body locked while open.
- Deep-link `#hash` jumps after async load; title not hidden under header.
- A `##`/`###` line inside a ``` bash block does **not** create a ghost TOC node.
- Changelog: version (h2) tree + search both present.
- Code blocks still Prism-highlight; no layout width regression.
