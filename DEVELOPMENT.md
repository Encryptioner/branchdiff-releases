# Development

The marketing page has no build step — it's plain HTML + CSS + JS served directly by GitHub Pages. To test locally:

## Quick start

```bash
# Python (built-in)
python3 -m http.server 8080

# Or Node.js
npx serve .

# Or PHP
php -S localhost:8080
```

Open `http://localhost:8080` in your browser.

## What to test

- **index.html** — landing page with install cards
- **guideline.html** — renders `content/guideline.md` via marked.js
- **changelog.html** — renders `content/changelog.md` via marked.js
- **Mobile responsiveness** — use browser DevTools device emulation (Chrome: F12 → toggle device toolbar)

## Notes

- The guideline and changelog pages will show "Failed to load" until the CI sync job populates `content/guideline.md` and `content/changelog.md`. This is expected for local development.
- Tailwind CSS loads from CDN — you need internet access.
- The version badge fetches from the GitHub API — it shows "latest" if the API call fails.
- To test with real content, create `content/guideline.md` and `content/changelog.md` manually.

## Files you can edit

| Path | Purpose |
|---|---|
| `index.html` | Landing page |
| `guideline.html` | Guide page wrapper |
| `changelog.html` | Changelog page wrapper |
| `styles/main.css` | Custom CSS |
| `scripts/main.js` | Install cards, version badge, nav |
| `assets/` | Logo, hero image, screenshots |

## Files managed by CI (do not edit)

| Path | Owner |
|---|---|
| `content/guideline.md` | Synced from private repo |
| `content/changelog.md` | Synced from private repo |
| `Formula/branchdiff.rb` | Auto-bumped on release |
| `bucket/branchdiff.json` | Auto-bumped on release |
| `apt/` | Signed APT repo — written by CI on every release. Do not edit. `.aptly-state.tar.gz` inside is CI persistence state. |
