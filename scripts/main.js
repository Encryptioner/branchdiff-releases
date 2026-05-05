// Marketing page glue: version badge, install cards with link buttons.
// Depends on: scripts/shared.js (header/footer).
// No frameworks. Plain DOM. Editable in public repo without build step.

const PUBLIC_REPO = 'encryptioner/branchdiff-releases';

const INSTALLERS = {
  npm: {
    title: 'Node.js (Node 18+)',
    icon: 'npm',
    tabs: [
      { label: 'npm', cmd: 'npm install -g @encryptioner/branchdiff' },
      { label: 'pnpm', cmd: 'pnpm install -g @encryptioner/branchdiff' },
      { label: 'yarn', cmd: 'yarn global add @encryptioner/branchdiff' },
    ],
    note: 'Bundled JS. Requires Node.',
    link: { label: 'npm package', url: 'https://www.npmjs.com/package/@encryptioner/branchdiff' },
  },
  pip: {
    title: 'Python (universal)',
    icon: 'pip',
    tabs: [
      { label: 'pip', cmd: 'pip install branchdiff' },
      { label: 'uv', cmd: 'uv tool install branchdiff' },
      { label: 'pipx', cmd: 'pipx install branchdiff' },
    ],
    note: 'Auto-selects the right binary for your OS+arch.',
    link: { label: 'PyPI page', url: 'https://pypi.org/project/branchdiff/' },
  },
  brew: {
    title: 'Homebrew (macOS / Linux)',
    icon: 'brew',
    cmd: 'brew tap encryptioner/branchdiff https://github.com/encryptioner/branchdiff-releases\nbrew install branchdiff',
    note: 'Static binary. No Node needed.',
    link: { label: 'Homebrew', url: 'https://brew.sh/' },
  },
  scoop: {
    title: 'Scoop (Windows)',
    icon: 'scoop',
    cmd: 'scoop bucket add branchdiff https://github.com/encryptioner/branchdiff-releases\nscoop install branchdiff',
    note: 'Static .exe. No Node needed.',
    link: { label: 'Scoop', url: 'https://scoop.sh/' },
  },
  // snap: {
  //   title: 'Snap (Linux)',
  //   icon: 'snap',
  //   cmd: 'sudo snap install branchdiff --classic',
  //   note: 'Classic confinement (reads any local repo).',
  //   link: { label: 'Snap Store', url: 'https://snapcraft.io/branchdiff' },
  // },
  apt: {
    title: 'apt (Debian / Ubuntu)',
    icon: 'apt',
    cmd: 'sudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://encryptioner.github.io/branchdiff-releases/apt/key.gpg \\\n  | sudo tee /etc/apt/keyrings/branchdiff.gpg > /dev/null\necho "deb [signed-by=/etc/apt/keyrings/branchdiff.gpg arch=amd64,arm64] https://encryptioner.github.io/branchdiff-releases/apt stable main" \\\n  | sudo tee /etc/apt/sources.list.d/branchdiff.list\nsudo apt update && sudo apt install branchdiff',
    note: 'GPG-signed APT repo. One-time setup.',
    link: { label: 'APT repo', url: 'https://encryptioner.github.io/branchdiff-releases/apt/' },
  },
  exe: {
    title: 'Direct download (Windows)',
    icon: 'win',
    cmd: 'Download branchdiff-win-x64.exe from the Releases page,\nrename to branchdiff.exe, move to a folder on PATH.',
    note: 'SmartScreen warning on first run — click "More info → Run anyway".',
    isText: true,
    link: { label: 'Releases', url: 'https://github.com/Encryptioner/branchdiff-releases/releases' },
  },
};

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linkIcon() {
  return '<svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>';
}

function renderCard(card) {
  const slug = card.dataset.install;
  const info = INSTALLERS[slug];
  if (!info) return;

  card.className =
    'install-card rounded-xl ring-1 ring-slate-200 bg-white p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md transition min-w-0';

  if (info.tabs) {
    renderTabbedCard(card, info);
  } else {
    renderSingleCard(card, info);
  }
}

function renderTabbedCard(card, info) {
  const tabs = info.tabs;
  const firstCmd = tabs[0].cmd;
  const linkHtml = info.link
    ? `<a href="${info.link.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition">${linkIcon()} ${info.link.label}</a>`
    : '';

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <h3 class="font-semibold text-slate-900 text-sm sm:text-base">${info.title}</h3>
      <div class="flex items-center gap-2 shrink-0">
        ${linkHtml}
        <button class="copy-btn text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">Copy</button>
      </div>
    </div>
    <div class="flex gap-1 border-b border-slate-200 -mb-[1px]">
      ${tabs.map((t, i) =>
        `<button class="tab-btn px-2 sm:px-3 py-1.5 text-xs font-medium rounded-t transition ${i === 0 ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}" data-tab="${i}">${t.label}</button>`
      ).join('')}
    </div>
    <pre class="cmd-block text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre break-all leading-relaxed max-h-40 overflow-y-auto"><code>${escapeHtml(firstCmd)}</code></pre>
    <p class="text-xs text-slate-500 mt-auto">${info.note}</p>
  `;

  // Tab switching
  card.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.tab);
      card.querySelectorAll('.tab-btn').forEach((b, i) => {
        if (i === idx) {
          b.className = 'tab-btn px-2 sm:px-3 py-1.5 text-xs font-medium rounded-t transition text-indigo-600 bg-indigo-50 border-b-2 border-indigo-500';
        } else {
          b.className = 'tab-btn px-2 sm:px-3 py-1.5 text-xs font-medium rounded-t transition text-slate-500 hover:text-slate-700 hover:bg-slate-50';
        }
      });
      card.querySelector('.cmd-block code').innerHTML = escapeHtml(tabs[idx].cmd);
      card.dataset.currentCmd = tabs[idx].cmd;
    });
  });

  // Copy button
  card.dataset.currentCmd = firstCmd;
  const btn = card.querySelector('.copy-btn');
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(card.dataset.currentCmd);
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = 'Copy'), 1500);
  });
}

function renderSingleCard(card, info) {
  const cmd = info.cmd;
  const linkHtml = info.link
    ? `<a href="${info.link.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition">${linkIcon()} ${info.link.label}</a>`
    : '';

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <h3 class="font-semibold text-slate-900 text-sm sm:text-base">${info.title}</h3>
      <div class="flex items-center gap-2 shrink-0">
        ${linkHtml}
        ${info.isText ? '' : '<button class="copy-btn text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">Copy</button>'}
      </div>
    </div>
    <pre class="cmd-block text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre break-all leading-relaxed max-h-40 overflow-y-auto"><code>${escapeHtml(cmd)}</code></pre>
    <p class="text-xs text-slate-500 mt-auto">${info.note}</p>
  `;
  const btn = card.querySelector('.copy-btn');
  if (btn) {
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(cmd);
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1500);
    });
  }
}

async function loadVersionBadge() {
  const badge = document.getElementById('version-badge');
  if (!badge) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${PUBLIC_REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    badge.textContent = data.tag_name || '';
  } catch {
    badge.textContent = 'latest';
  }
}

// Init
document.querySelectorAll('.install-card').forEach(renderCard);
loadVersionBadge();
