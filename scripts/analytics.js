/**
 * branchdiff-releases — Google Analytics event tracking module.
 *
 * Vanilla JS (no build step). All events are anonymous — no PII is ever sent.
 * GA measurement ID is configured in the HTML <head> gtag snippet.
 */

// ── Type definitions ──────────────────────────────────────────────────────────

/**
 * @typedef {
 *   | { name: 'install_cmd_copied',    params: { channel: string, variant: string } }
 *   | { name: 'install_tab_switched',  params: { channel: string, tab: string } }
 *   | { name: 'install_link_clicked',  params: { channel: string, label: string } }
 *   | { name: 'nav_clicked',           params: { destination: string } }
 *   | { name: 'external_link_clicked', params: { label: string, destination: string } }
 *   | { name: 'resource_card_clicked', params: { title: string, destination: string } }
 *   | { name: 'section_scrolled',      params: { section: string } }
 *   | { name: 'content_loaded',        params: { page: string } }
 *   | { name: 'error_occurred',        params: { category: string, action: string, error: string } }
 * } AnalyticsEvent
 */

// ── Core tracking function ────────────────────────────────────────────────────

/**
 * Send a typed analytics event to Google Analytics.
 * No-ops gracefully when gtag is unavailable (ad blockers, offline).
 *
 * @param {AnalyticsEvent} event
 * @returns {void}
 */
function trackEvent(event) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const { name, ...rest } = event;
  const params = 'params' in rest ? rest.params : undefined;
  window.gtag('event', name, params);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const _EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.\w+/g;

/**
 * Strip email addresses from error messages and truncate to 100 chars.
 *
 * @param {string} msg
 * @returns {string}
 */
function sanitizeError(msg) {
  return String(msg).replace(_EMAIL_PATTERN, '[email]').slice(0, 100);
}

// ── Export ────────────────────────────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trackEvent, sanitizeError };
}
