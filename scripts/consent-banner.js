/**
 * consent-banner — reproduces the site's cookie-consent bar (matches the live
 * Wix banner) and wires it into the project's dummy CMP (consent-check.js).
 * The choice is stored in localStorage; "Zustimmen" grants consent so
 * consented.js loads. Purely presentational otherwise.
 */
const KEY = 'rebhaus-consent';

function store(v) { try { localStorage.setItem(KEY, v); } catch { /* unavailable */ } }
function read() { try { return localStorage.getItem(KEY); } catch { return null; } }

export default function initConsentBanner() {
  if (read()) return; // already chosen this browser
  if (document.querySelector('.consent-bar')) return;

  const bar = document.createElement('div');
  bar.className = 'consent-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie-Hinweis');
  bar.innerHTML = `
    <p>Diese Website verwendet Cookies, um ein verbessertes Nutzererlebnis zu bieten. Per Klick auf «Zustimmen» erkläre ich mich mit der Verwendung von Cookies einverstanden. <a href="/datenschutz">Datenschutzerklärung</a></p>
    <div class="consent-actions">
      <button type="button" data-action="settings">Einstellungen</button>
      <button type="button" data-action="decline">Alle ablehnen</button>
      <button type="button" class="accept" data-action="accept">Zustimmen</button>
      <button type="button" class="consent-close" data-action="close" aria-label="Schliessen">×</button>
    </div>`;

  const dismiss = (choice) => {
    if (choice) store(choice);
    if (choice === 'accept') {
      const url = new URL(window.location.href);
      url.searchParams.set('consent', 'accept');
      window.history.replaceState({}, '', url);
      window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented: true } }));
      import('./consented.js');
    }
    bar.remove();
  };

  bar.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (!action || action === 'settings') return;
    dismiss(action === 'accept' ? 'accept' : 'decline');
  });

  document.body.append(bar);
}
