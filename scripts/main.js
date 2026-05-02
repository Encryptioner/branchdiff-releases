// Marketing page glue: version badge, install cards, footer year.
// No frameworks. Plain DOM. Editable in public repo without build step.

const PUBLIC_REPO = 'encryptioner/branchdiff-releases';

// Pretty-print install commands per channel. Single source of truth so
// the install grid order can be reshuffled in HTML without re-typing.
const INSTALLERS = {
  npm: {
    title: 'npm (Node 18+)',
    icon: 'npm',
    cmd: 'pnpm install -g @encryptioner/branchdiff',
    note: 'Bundled JS. Requires Node.',
  },
  brew: {
    title: 'Homebrew (macOS / Linux)',
    icon: 'brew',
    cmd: 'brew tap encryptioner/branchdiff https://github.com/encryptioner/branchdiff-releases\nbrew install branchdiff',
    note: 'Single static binary. No Node needed.',
  },
  scoop: {
    title: 'Scoop (Windows)',
    icon: 'scoop',
    cmd: 'scoop bucket add branchdiff https://github.com/encryptioner/branchdiff-releases\nscoop install branchdiff',
    note: 'Single static .exe. No Node needed.',
  },
  pip: {
    title: 'pip / uv / pipx (universal)',
    icon: 'pip',
    cmd: 'pip install branchdiff',
    note: 'Auto-selects the right binary for your OS+arch.',
  },
  snap: {
    title: 'Snap (Linux)',
    icon: 'snap',
    cmd: 'sudo snap install branchdiff --classic',
    note: 'Classic confinement (reads any local repo).',
  },
  apt: {
    title: 'apt (Debian / Ubuntu)',
    icon: 'apt',
    cmd: `sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://encryptioner.github.io/branchdiff-releases/apt/key.gpg \\
  | sudo tee /etc/apt/keyrings/branchdiff.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/branchdiff.gpg arch=amd64,arm64] https://encryptioner.github.io/branchdiff-releases/apt stable main" \\
  | sudo tee /etc/apt/sources.list.d/branchdiff.list
sudo apt update && sudo apt install branchdiff`,
    note: 'GPG-signed APT repo. One-time setup.',
  },
  exe: {
    title: 'Direct .exe (Windows, no package manager)',
    icon: 'win',
    cmd: 'Download branchdiff-win-x64.exe from the Releases page,\nrename to branchdiff.exe, move to a folder on PATH.',
    note: 'SmartScreen warning on first run — click "More info → Run anyway".',
    isText: true,
  },
};

function renderCard(card) {
  const slug = card.dataset.install;
  const info = INSTALLERS[slug];
  if (!info) return;
  const cmd = info.isText ? info.cmd : info.cmd;
  card.className =
    'install-card rounded-xl ring-1 ring-slate-200 bg-white p-5 flex flex-col gap-3 hover:shadow-md transition';
  card.innerHTML = `
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-slate-900">${info.title}</h3>
      ${info.isText ? '' : '<button class="copy-btn text-xs px-2 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100">Copy</button>'}
    </div>
    <pre class="text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre">${escapeHtml(cmd)}</pre>
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

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

// Init
document.querySelectorAll('.install-card').forEach(renderCard);
loadVersionBadge();
setYear();
