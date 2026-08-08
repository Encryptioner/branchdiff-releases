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

async function loadVersionBadge() {
  const badge = document.getElementById('version-badge');
  if (!badge) return;

  const cached = sessionStorage.getItem(VERSION_CACHE_KEY);
  if (cached) {
    badge.textContent = cached;
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${PUBLIC_REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const version = data.tag_name || 'latest';
    badge.textContent = version;
    sessionStorage.setItem(VERSION_CACHE_KEY, version);
  } catch {
    badge.textContent = 'latest';
  }
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
  const nodes = headings.map((h, i) => {
    let endLine = lines.length;
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) { endLine = headings[j].line; break; }
    }
    return {
      id: slugify(h.text),
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
    if (!isDesktop()) return;
    for (const el of elById.values()) el.classList.remove('toc-active');
    if (!activeId) return;
    for (const [id, el] of elById) {
      const node = idMap.get(id);
      if (node && (node.id === activeId || containsId(node, activeId))) el.classList.add('toc-active');
    }
    const first = treeEl.querySelector('.toc-active');
    if (first) first.scrollIntoView({ block: 'nearest' });
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

  render();
}
