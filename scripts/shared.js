// Shared header + footer injected into every page.
// Keeps nav, footer, and support section identical across index / guideline / changelog.

const SITE_NAME = 'branchdiff';
const LOGO_PATH = './assets/logo.svg';
const GITHUB_REPO = 'https://github.com/Encryptioner/branchdiff-releases';
const SPONSOR_URL = 'https://www.supportkori.com/mirmursalinankur';

const NAV_ITEMS = [
  { label: 'Home', href: './', match: 'index' },
  { label: 'Guide', href: './guideline.html', match: 'guideline' },
  { label: 'Changelog', href: './changelog.html', match: 'changelog' },
];

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.endsWith('guideline.html')) return 'guideline';
  if (path.endsWith('changelog.html')) return 'changelog';
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

  const navLinks = NAV_ITEMS.map(n => {
    const active = n.match === current;
    return `<a href="${n.href}" class="px-3 py-2 rounded ${active ? 'text-slate-900 bg-slate-100 font-medium' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}">${n.label}</a>`;
  }).join('');

  const featHref = current === 'index' ? '#features' : './#features';
  const instHref = current === 'index' ? '#install' : './#install';

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
          <p class="font-semibold text-slate-900 mb-2">${SITE_NAME}</p>
          <p>© <span id="year"></span> Mir Mursalin Ankur. Free &amp; Seamless integration.</p>
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
