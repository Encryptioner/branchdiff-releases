// Shared header + footer injected into every page.
// Keeps nav, footer, and support section identical across index / guideline / changelog.

const SITE_NAME = 'branchdiff';
const LOGO_PATH = './assets/logo.svg';
const GITHUB_REPO = 'https://github.com/Encryptioner/branchdiff-releases';
const SPONSOR_URL = 'https://www.supportkori.com/mirmursalinankur';
const PUBLIC_REPO = 'encryptioner/branchdiff-releases';
const VERSION_CACHE_KEY = 'branchdiff-version';

const NAV_ITEMS = [
  { label: 'Home', href: './', match: 'index' },
  { label: 'Guide', href: './guideline.html', match: 'guideline' },
  { label: 'Changelog', href: './changelog.html', match: 'changelog' },
];

function getCurrentPage() {
  const path = window.location.pathname;
  if (/\/guideline(\.html)?$/.test(path)) return 'guideline';
  if (/\/changelog(\.html)?$/.test(path)) return 'changelog';
  return 'index';
}

function githubIcon(cls = 'w-4 h-4') {
  return `<svg class="${cls}" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;
}

function starIcon(cls = 'w-4 h-4') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;
}

function heartIcon(cls = 'w-4 h-4') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`;
}

function renderHeader(container) {
  const current = getCurrentPage();
  const basePath = window.location.pathname.replace(/[^/]*$/, '');
  const homeUrl = window.location.origin + basePath;

  const navLinks = NAV_ITEMS.map(n => {
    const active = n.match === current;
    return `<a href="${n.href}" class="px-3 py-2 rounded ${active ? 'text-slate-900 bg-slate-100 font-medium' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}">${n.label}</a>`;
  }).join('');

  const featHref = current === 'index' ? '#features' : `${homeUrl}#features`;
  const instHref = current === 'index' ? '#install' : `${homeUrl}#install`;

  const desktopExtra = `<a href="${featHref}" class="px-3 py-2 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-100">Features</a>
       <a href="${instHref}" class="px-3 py-2 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-100">Install</a>`;

  const mobileExtra = `<a href="${featHref}" class="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100">Features</a>
       <a href="${instHref}" class="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100">Install</a>`;

  container.innerHTML = `
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <a href="./" class="flex items-center gap-2 font-semibold text-slate-900">
        <img src="${LOGO_PATH}" alt="" class="h-7 w-7" />
        <span>${SITE_NAME}</span>
        <span id="version-badge" class="hidden sm:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">v…</span>
      </a>
      <div class="hidden sm:flex items-center gap-1 text-sm">
        ${desktopExtra}${navLinks}
        <a href="${GITHUB_REPO}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-2 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-100">
          ${githubIcon()} GitHub
        </a>
      </div>
      <button id="mobile-menu-btn" class="sm:hidden p-2 rounded text-slate-700 hover:bg-slate-100" aria-label="Toggle menu">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </nav>
    <div id="mobile-menu" class="hidden sm:hidden bg-white border-b border-slate-200 px-4 pb-4">
      ${mobileExtra}${NAV_ITEMS.map(n => {
        const active = n.match === current;
        return `<a href="${n.href}" class="block px-3 py-2 rounded ${active ? 'text-slate-900 bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}">${n.label}</a>`;
      }).join('')}
      <a href="${GITHUB_REPO}" target="_blank" rel="noopener" class="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100">GitHub</a>
    </div>
  `;

  container.classList.add('sticky', 'top-0', 'z-30', 'bg-white/80', 'backdrop-blur', 'border-b', 'border-slate-200');
}

function renderFooter(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <!-- Support callout -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200 mb-6">
        <p class="text-sm text-slate-600 flex-1">
          If branchdiff saves you time, support its development — give it a star or sponsor the project.
        </p>
        <div class="flex flex-wrap gap-2">
          <a href="${GITHUB_REPO}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition">
            ${starIcon('w-3.5 h-3.5')} Star on GitHub
          </a>
          <a href="${SPONSOR_URL}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 transition">
            ${heartIcon('w-3.5 h-3.5')} Sponsor
          </a>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row justify-between gap-4 text-sm text-slate-600">
        <div>
          <div class="flex -ml-2">
            <img src="${LOGO_PATH}" alt="" class="h-7 w-7" />  
            <p class="font-semibold text-slate-900 mb-2">${SITE_NAME}</p>
          </div>
          <p>© <span id="year"></span> 
          <a href="https://encryptioner.github.io/" target="_blank" rel="noopener" class="hover:text-slate-900 transition">Mir Mursalin Ankur.</a>
          Free &amp; Seamless integration.</p>
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <a href="./guideline.html" class="hover:text-slate-900 transition">Guide</a>
          <a href="./changelog.html" class="hover:text-slate-900 transition">Changelog</a>
          <a href="https://www.npmjs.com/package/@encryptioner/branchdiff" target="_blank" rel="noopener" class="hover:text-slate-900 transition">npm</a>
          <a href="https://pypi.org/project/branchdiff/" target="_blank" rel="noopener" class="hover:text-slate-900 transition">PyPI</a>
          <a href="https://snapcraft.io/branchdiff" target="_blank" rel="noopener" class="hover:text-slate-900 transition hidden">Snap</a>
          <a href="${GITHUB_REPO}" target="_blank" rel="noopener" class="hover:text-slate-900 transition">GitHub</a>
          <a href="${SPONSOR_URL}" target="_blank" rel="noopener" class="hover:text-slate-900 transition">Sponsor</a>
        </div>
      </div>
    </div>
  `;

  container.classList.add('border-t', 'border-slate-200', 'bg-white');
}

// Live release detection: probe every install channel's public version
// endpoint, show the HIGHEST shipped version (a channel can run ahead —
// e.g. npm publishes from main while a binary release action failed).
// Header badge (#version-badge) shows on every page; hero badge
// (#release-badge) and channel chips (#channel-status) only on index.
// ponytail: snap excluded — snapcraft API needs auth headers, no plain CORS GET.
const RELEASE_CHANNELS = [
  {
    id: 'npm', label: 'npm',
    url: 'https://registry.npmjs.org/@encryptioner/branchdiff/latest',
    json: true, pick: (d) => d.version,
  },
  {
    id: 'github', label: 'Binaries (GitHub)',
    url: `https://api.github.com/repos/${PUBLIC_REPO}/releases/latest`,
    json: true, pick: (d) => (d.tag_name || '').replace(/^v/, ''),
  },
  {
    id: 'pip', label: 'PyPI',
    url: 'https://pypi.org/pypi/branchdiff/json',
    json: true, pick: (d) => d.info && d.info.version,
  },
  {
    id: 'brew', label: 'Homebrew',
    url: './Formula/branchdiff.rb',
    json: false, pick: (t) => (t.match(/version\s+"([^"]+)"/) || [])[1],
  },
  {
    id: 'scoop', label: 'Scoop',
    url: './bucket/branchdiff.json',
    json: true, pick: (d) => d.version,
  },
  {
    id: 'apt', label: 'APT',
    url: './apt/dists/stable/main/binary-amd64/Packages',
    json: false, pick: (t) => ((t.match(/^Version:\s*(.+)$/m) || [])[1] || '').trim(),
  },
];

// Numeric X.Y.Z compare — channels tag plain semver, no prerelease suffixes.
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

function fetchChannelVersion(channel) {
  return fetch(channel.url)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(channel.id + ' HTTP ' + r.status))))
    .then((body) => {
      const version = channel.pick(channel.json ? JSON.parse(body) : body);
      if (!version) throw new Error(channel.id + ': no version in response');
      return version;
    })
    .catch(() => null); // network/CORS/rate-limit → unknown, not "broken"
}

function renderReleaseStatus(versions) {
  const answered = versions.filter(Boolean);
  if (!answered.length) return; // every probe failed: keep static fallback text

  // Canonical for badges: the HIGHEST version any channel actually shipped.
  const canonical = answered.reduce((max, v) => (compareVersions(v, max) > 0 ? v : max));
  const allCurrent = versions.every((v) => v === canonical);

  const headerBadge = document.getElementById('version-badge');
  if (headerBadge) headerBadge.textContent = 'v' + canonical;

  const heroBadge = document.getElementById('release-badge');
  if (heroBadge) {
    const text = heroBadge.querySelector('[data-version]');
    if (text) text.textContent = 'v' + canonical;
    const dot = heroBadge.querySelector('[data-dot]');
    if (dot) dot.className = 'w-2 h-2 rounded-full ' + (allCurrent ? 'bg-emerald-500' : 'bg-amber-500');
  }

  const status = document.getElementById('channel-status');
  if (!status) return;
  status.textContent = '';
  status.setAttribute('aria-label', 'Latest release per install channel');
  RELEASE_CHANNELS.forEach((channel, i) => {
    const v = versions[i];
    const chip = document.createElement('span');
    chip.className = v === canonical
      ? 'text-emerald-700'
      : v ? 'text-amber-700' : 'text-slate-400';
    chip.textContent = channel.label + ' ' + (v || '?');
    status.appendChild(chip);
    if (i < RELEASE_CHANNELS.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'text-slate-300 mx-1';
      sep.textContent = '|';
      status.appendChild(sep);
    }
  });
}

async function loadVersionBadge() {
  const hasHeader = document.getElementById('version-badge');
  const hasHero = document.getElementById('release-badge');
  if (!hasHeader && !hasHero) return;

  // Cache shape: JSON array of per-channel versions. Older sessions may hold
  // a plain "vX.Y.Z" string from the previous GitHub-only badge — treat any
  // non-JSON value as a miss and re-probe once.
  const cached = sessionStorage.getItem(VERSION_CACHE_KEY);
  if (cached) {
    try {
      renderReleaseStatus(JSON.parse(cached));
      return;
    } catch { /* stale shape — fall through to live probe */ }
  }

  if (typeof fetch !== 'function') return; // ancient browser: static fallback stays
  const versions = await Promise.all(RELEASE_CHANNELS.map(fetchChannelVersion));
  if (versions.some(Boolean)) {
    try { sessionStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(versions)); } catch { /* private mode */ }
  }
  renderReleaseStatus(versions);
}

function initShared() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  if (header) renderHeader(header);
  if (footer) renderFooter(footer);

  // Mobile nav
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Version badge — use cached version if available
  loadVersionBadge();

  // Analytics — internal nav clicks
  if (header) {
    header.querySelectorAll('nav a, #mobile-menu a').forEach(a => {
      a.addEventListener('click', () => {
        const text = (a.textContent || '').trim();
        if (!text) return;
        const isExternal = a.target === '_blank';
        if (isExternal) {
          trackEvent({ name: 'external_link_clicked', params: { label: text, destination: 'github' } });
        } else {
          trackEvent({ name: 'nav_clicked', params: { destination: text.toLowerCase() } });
        }
      });
    });
  }

  // Analytics — footer external links
  if (footer) {
    footer.querySelectorAll('a[target="_blank"]').forEach(a => {
      a.addEventListener('click', () => {
        const text = (a.textContent || '').trim();
        if (!text) return;
        trackEvent({ name: 'external_link_clicked', params: { label: text, destination: new URL(a.href).hostname } });
      });
    });
  }
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}

// ── Table of Contents ────────────────────────────────────────────────────────

function slugify(text) {
  return (text || '').toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// "Part 2 · View & explore" → "View & explore" (subtitle after the middot).
// No middot → returns the text unchanged.
function partLabel(text) {
  return (text || '').split('·').pop().trim() || (text || '');
}

// ── TOC tree helpers ─────────────────────────────────────────────────────────
// Ported from ../branchdiff/packages/ui/src/lib/toc.ts. Framework-free string
// manipulation — verbatim except scanHeadings skips fenced code blocks (the
// static site's marked.js already excludes them, so the tree and the rendered
// DOM must agree on heading count). See docs/superpowers/specs/2026-08-08-nested-toc.md.

const TOC_HEADING_RE = /^(#{2,5})\s+(.+)$/;
const TOC_PART_RE = /^Part\s+\d+/i;
const TOC_FENCE_RE = /^\s*(`{3,}|~{3,})/;

function scanHeadings(lines) {
  const headings = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (TOC_FENCE_RE.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = TOC_HEADING_RE.exec(line);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: i });
  });
  return headings;
}

// Nested h2–h5 tree. Each node's fullText spans its heading through the next
// same-or-higher heading, so it includes every descendant — one substring check
// per node is enough to know if it (or anything under it) matches a search.
function buildTocTree(markdown) {
  const lines = markdown.split('\n');
  const headings = scanHeadings(lines);
  const slugCounts = new Map(); // dedupe: changelog repeats "Added"/"Fixed"/etc. per version
  const nodes = headings.map((h, i) => {
    let endLine = lines.length;
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) { endLine = headings[j].line; break; }
    }
    const base = slugify(h.text);
    const count = (slugCounts.get(base) || 0) + 1;
    slugCounts.set(base, count);
    return {
      id: count === 1 ? base : `${base}-${count}`,
      text: h.text,
      level: h.level,
      isPart: TOC_PART_RE.test(h.text),
      fullText: lines.slice(h.line, endLine).join('\n'),
      children: [],
    };
  });
  const roots = [];
  const stack = [];
  for (const node of nodes) {
    while (stack.length && stack[stack.length - 1].level >= node.level) stack.pop();
    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return roots;
}

function filterTocTree(nodes, query) {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const result = [];
  for (const node of nodes) {
    if (!node.fullText.toLowerCase().includes(q)) continue;
    result.push({ ...node, children: filterTocTree(node.children, q) });
  }
  return result;
}

// Depth-first in document order — matches the rendered DOM heading order, so the
// i-th node pairs with the i-th rendered <hN>.
function flattenNodes(nodes) {
  const out = [];
  for (const n of nodes) { out.push(n); out.push(...flattenNodes(n.children)); }
  return out;
}

function containsId(node, id) {
  if (!id) return false;
  return node.children.some(c => c.id === id || containsId(c, id));
}

/**
 * Build a nested h2–h5 table of contents from markdown and inject into tocEl.
 * contentEl holds the already-rendered markdown (marked.parse); md is the raw
 * source the tree is built from. One tree element is reused as a desktop sticky
 * sidebar (≥1024px) and a mobile slide-in drawer (<1024px) via CSS.
 */
function buildTOC(contentEl, tocEl, md) {
  const tree = buildTocTree(md);
  const flat = flattenNodes(tree);
  const flatIndex = new Map(flat.map((n, i) => [n.id, i])); // id → document-order index
  const domHeadings = Array.from(contentEl.querySelectorAll('h2,h3,h4,h5'));

  // Safety net: bail (hide TOC) if the markdown tree and rendered DOM disagree.
  // Positional pairing below guarantees id sync when they agree.
  if (!flat.length || flat.length !== domHeadings.length || flat.length < 3) {
    tocEl.hidden = true;
    return;
  }
  flat.forEach((node, i) => { domHeadings[i].id = node.id; });

  const idMap = new Map(flat.map(n => [n.id, n]));
  const isDesktop = () => window.innerWidth >= 1024;

  // Parts quick-jump strip (#parts-nav). Only top-level "Part N" roots count.
  const partsNavEl = document.getElementById('parts-nav');
  const parts = tree.filter(n => n.isPart);
  const partTabEls = new Map(); // partId → tab button (populated when rendered)

  let search = '';
  let activeId = null;
  const collapsed = new Set();
  let elById = new Map(); // id → rendered row element (rebuilt each render)

  tocEl.innerHTML = '';

  // ── Shell: trigger (mobile) + backdrop + panel (tree host) ──
  const trigger = document.createElement('button');
  trigger.className = 'toc-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'toc-panel');
  trigger.innerHTML =
    '<span class="toc-trigger-label">On this page</span>' +
    '<svg class="toc-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 7l5 5 5-5"/></svg>';

  const backdrop = document.createElement('div');
  backdrop.className = 'toc-backdrop';

  const panel = document.createElement('div');
  panel.className = 'toc-panel';
  panel.id = 'toc-panel';

  const head = document.createElement('div');
  head.className = 'toc-panel-head';
  head.innerHTML =
    '<span class="toc-panel-title">Sections</span>' +
    '<button type="button" class="toc-panel-close" aria-label="Close table of contents">' +
      '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>' +
    '</button>';

  const desktopTitle = document.createElement('span');
  desktopTitle.className = 'toc-desktop-title';
  desktopTitle.textContent = 'On this page';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'toc-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'toc-search-input';
  searchInput.placeholder = 'Search sections & content…';
  searchInput.setAttribute('aria-label', 'Search table of contents');
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'toc-search-clear';
  clearBtn.setAttribute('aria-label', 'Clear search');
  clearBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>';
  clearBtn.hidden = true;
  searchWrap.appendChild(searchInput);
  searchWrap.appendChild(clearBtn);

  const treeEl = document.createElement('nav');
  treeEl.className = 'toc-tree';
  treeEl.setAttribute('aria-label', 'Section navigation');

  const noResults = document.createElement('p');
  noResults.className = 'toc-no-results';
  noResults.textContent = 'No matching sections';
  noResults.hidden = true;

  panel.appendChild(head);
  panel.appendChild(desktopTitle);
  panel.appendChild(searchWrap);
  panel.appendChild(treeEl);
  panel.appendChild(noResults);
  tocEl.appendChild(trigger);
  tocEl.appendChild(backdrop);
  tocEl.appendChild(panel);

  // ── Render ──
  function renderNode(node) {
    const wrap = document.createElement('div');
    wrap.className = 'toc-node toc-l' + node.level;

    const row = document.createElement('div');
    row.className = 'toc-row';
    row.dataset.id = node.id;
    if (node.isPart) wrap.classList.add('toc-part');

    const hasKids = node.children.length > 0;
    if (hasKids) {
      const chev = document.createElement('button');
      chev.type = 'button';
      chev.className = 'toc-chevron-btn' + (collapsed.has(node.id) ? '' : ' toc-chevron-open');
      chev.setAttribute('aria-label', (collapsed.has(node.id) ? 'Expand' : 'Collapse') + ' section');
      chev.innerHTML = '<svg class="toc-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7 5l5 5-5 5"/></svg>';
      chev.addEventListener('click', e => {
        e.stopPropagation();
        if (collapsed.has(node.id)) collapsed.delete(node.id);
        else collapsed.add(node.id);
        render();
      });
      row.appendChild(chev);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'toc-chevron-spacer';
      row.appendChild(spacer);
    }

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'toc-text';
    label.textContent = node.text;
    row.appendChild(label);

    wrap.appendChild(row);
    if (!collapsed.has(node.id)) {
      node.children.forEach(c => wrap.appendChild(renderNode(c)));
    }
    return wrap;
  }

  function render() {
    const filtered = filterTocTree(tree, search);
    treeEl.innerHTML = '';
    if (filtered.length === 0) {
      noResults.hidden = false;
      elById = new Map();
      return;
    }
    noResults.hidden = true;
    filtered.forEach(n => treeEl.appendChild(renderNode(n)));
    elById = new Map();
    treeEl.querySelectorAll('.toc-row[data-id]').forEach(el => elById.set(el.dataset.id, el));
    updateActive();
  }

  // Click any row (or its label) → scroll. Chevron has its own listener + stopPropagation.
  treeEl.addEventListener('click', e => {
    const row = e.target.closest('.toc-row[data-id]');
    if (row && treeEl.contains(row)) scrollToId(row.dataset.id);
  });

  // ── Scroll + drawer close ──
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!isDesktop()) closeDrawer(); // unlock body scroll before smooth-scroll
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  }

  // ── Search ──
  searchInput.addEventListener('input', () => {
    search = searchInput.value;
    clearBtn.hidden = !search;
    render();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    search = '';
    clearBtn.hidden = true;
    render();
    searchInput.focus();
  });

  // ── Mobile drawer open/close ──
  function openDrawer() {
    tocEl.classList.add('toc-open');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    tocEl.classList.remove('toc-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  trigger.addEventListener('click', () => {
    if (tocEl.classList.contains('toc-open')) closeDrawer(); else openDrawer();
  });
  head.querySelector('.toc-panel-close').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tocEl.classList.contains('toc-open')) closeDrawer();
  });

  // ── Active-section spy (desktop only — mobile drawer is closed while reading) ──
  // One IntersectionObserver tracks every visible heading; pick the topmost in
  // document order (many short h4s can intersect at once). Highlight the active
  // node plus all its ancestors.
  function updateActive() {
    // Parts strip tracks scroll on mobile too — desktop-only TOC highlight is below.
    updateActivePart();
    if (!isDesktop()) return;
    for (const el of elById.values()) el.classList.remove('toc-active');
    if (!activeId) return;
    for (const [id, el] of elById) {
      const node = idMap.get(id);
      if (node && (node.id === activeId || containsId(node, activeId))) el.classList.add('toc-active');
    }
    // Keep the active row visible inside the sidebar tree. Avoid scrollIntoView
    // here — a second scrollIntoView cancels any in-flight smooth-scroll to a
    // heading (sidebar, parts-strip, and in-content #anchor links all route
    // through scrollToId), so far targets would abort partway. Move only the
    // tree's own scrollTop.
    const first = treeEl.querySelector('.toc-active');
    if (first) {
      const rowTop = first.getBoundingClientRect().top - treeEl.getBoundingClientRect().top;
      if (rowTop < 8) treeEl.scrollTop += rowTop - 8;
      else {
        const below = rowTop + first.offsetHeight - treeEl.clientHeight;
        if (below > 8) treeEl.scrollTop += below + 8;
      }
    }
  }

  const ids = flat.map(n => n.id);
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const ent of entries) {
      if (ent.isIntersecting) visible.add(ent.target.id);
      else visible.delete(ent.target.id);
    }
    const topmost = ids.find(id => visible.has(id));
    if (topmost && topmost !== activeId) { activeId = topmost; updateActive(); }
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
  domHeadings.forEach(h => observer.observe(h));

  window.addEventListener('resize', () => {
    if (isDesktop()) document.body.style.overflow = '';
    updateActive();
  }, { passive: true });

  // ── In-page #anchor links inside the rendered markdown ──
  contentEl.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (document.getElementById(id)) { e.preventDefault(); scrollToId(id); }
  });

  // ── Deep-link on load (content is async-fetched; the browser's auto-scroll
  //    to the fragment fires before headings exist, so do it ourselves) ──
  if (location.hash) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  // ── Parts quick-jump strip ──
  // One tab per top-level "Part N" heading, rendered into #parts-nav when the
  // page hosts it and ≥2 parts exist (guideline only — changelog's version
  // headings aren't "Part N", so the strip stays hidden there). Reuses this
  // closure's scrollToId + scroll-spy. updateActivePart() (below) is hoisted,
  // so updateActive can call it even though this block runs first.
  if (partsNavEl && parts.length >= 2) {
    partsNavEl.hidden = false;
    document.documentElement.classList.add('has-parts-nav');
    partsNavEl.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'parts-nav-inner';
    parts.forEach(p => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'parts-nav-tab';
      tab.textContent = partLabel(p.text);
      tab.setAttribute('aria-label', p.text);
      tab.addEventListener('click', () => scrollToId(p.id));
      inner.appendChild(tab);
      partTabEls.set(p.id, tab);
    });
    partsNavEl.appendChild(inner);
  }

  // Highlight the tab whose Part owns the active heading, and keep it in view.
  // Ownership is positional, not tree-containment: a Part owns everything from
  // its heading up to the next Part. The guide has non-Part top-level sections
  // between Parts (e.g. "## Code tours" between Part 2 and Part 3) — those are
  // sibling roots in the TOC tree, so containsId() can't assign them, but they
  // belong to the preceding Part's run (matches the reference app's breadcrumb).
  function updateActivePart() {
    if (!partsNavEl || partTabEls.size === 0) return;
    const activeIdx = activeId ? flatIndex.get(activeId) : -1;
    let activePartId = null;
    if (activeIdx >= 0) {
      for (const p of parts) {
        if (flatIndex.get(p.id) <= activeIdx) activePartId = p.id; // last Part at/before active
      }
    }
    for (const [pid, el] of partTabEls) {
      const on = pid === activePartId;
      el.classList.toggle('parts-nav-tab-active', on);
      if (on) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    }
    // Keep the active chip in horizontal view WITHOUT scrollIntoView — a second
    // scrollIntoView cancels the user's in-flight smooth-scroll to the Part
    // heading (the observer fires mid-scroll), so adjust scrollLeft directly.
    const activeTab = activePartId && partTabEls.get(activePartId);
    if (activeTab) {
      const inner = activeTab.parentElement; // .parts-nav-inner
      const left = activeTab.offsetLeft, right = left + activeTab.offsetWidth;
      if (left < inner.scrollLeft) inner.scrollLeft = left - 8;
      else if (right > inner.scrollLeft + inner.clientWidth) inner.scrollLeft = right - inner.clientWidth + 8;
    }
  }

  render();
}

// ── Copy-link buttons on doc headings (guide / changelog) ─────────────────────
// Each h2–h5 gets a small link-icon button that copies the section's URL.
// Reads the id buildTOC already stamped (canonical — matches the TOC scroll
// target, deduped for repeat changelog headings); falls back to slugify only if
// a heading has none (e.g. buildTOC bailed on very short content). Uses a
// <button>, not <a href="#id"> — buildTOC's delegated click handler would
// intercept the latter into a scroll instead of a copy.

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // ponytail: execCommand fallback for non-secure contexts (file://, old browsers)
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }
}

const _LINK_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>';
const _CHECK_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>';

function addCopyLinkButtons(contentEl) {
  const headings = contentEl.querySelectorAll('h2, h3, h4, h5');
  headings.forEach(h => {
    if (h.querySelector('.copy-link-btn')) return; // idempotent on re-render
    if (!h.id) h.id = slugify(h.textContent);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-link-btn';
    btn.setAttribute('aria-label', 'Copy link to section');
    btn.innerHTML =
      '<span class="copy-link-tip" aria-hidden="true">Copy link</span>' +
      '<svg class="copy-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' + _LINK_ICON + '</svg>';

    btn.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.hash = h.id;
      const ok = await copyText(url.toString());
      if (!ok) return;
      const tip = btn.querySelector('.copy-link-tip');
      const icon = btn.querySelector('.copy-link-icon');
      btn.classList.add('copy-link-done');
      btn.setAttribute('aria-label', 'Copied!');
      if (tip) tip.textContent = 'Copied!';
      if (icon) icon.innerHTML = _CHECK_ICON;
      trackEvent({ name: 'copy_section_link', params: { section: h.id } });
      setTimeout(() => {
        btn.classList.remove('copy-link-done');
        btn.setAttribute('aria-label', 'Copy link to section');
        if (tip) tip.textContent = 'Copy link';
        if (icon) icon.innerHTML = _LINK_ICON;
      }, 1600);
    });
    h.appendChild(btn);
  });
}
