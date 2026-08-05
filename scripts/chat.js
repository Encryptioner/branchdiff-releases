// Site-aware AI chat (private-chat) bootstrap — shared across index/guideline/
// changelog so the config and embed script tag can't drift between pages.
// Default scraper (no getSections) is generic enough for both the landing
// page's <main><section> layout and the markdown-rendered guide/changelog
// <article>: it walks headings/ids and skips <nav>/<footer> automatically.
// See private-chat docs/SITE-INTEGRATION.md.
window.PRIVATE_CHAT_CONFIG = {
  label: 'branchdiff',
  // Prod: fully-qualified, NOT "/site-index.json" — the widget iframe lives at
  // encryptioner.github.io/private-chat/, a sibling path on the SAME origin. A
  // root-relative path would resolve against that shared origin root (a
  // different project's site-index.json), not this one. See private-chat
  // docs/SITE-INTEGRATION.md § "Gotcha — siteIndexUrl on a shared origin".
  // Local (python3 -m http.server / npx serve): a bare relative path is fine.
  siteIndexUrl: /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? 'site-index.json'
    : 'https://encryptioner.github.io/branchdiff-releases/site-index.json',
};

const aiChatEmbedScript = document.createElement('script');
aiChatEmbedScript.id = 'aiChatEmbedScript';
aiChatEmbedScript.defer = true;
aiChatEmbedScript.src = 'https://encryptioner.github.io/private-chat/embed.js';
document.head.appendChild(aiChatEmbedScript);
