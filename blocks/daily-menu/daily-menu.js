import { loadFragment } from '../fragment/fragment.js';

/**
 * daily-menu — the home page's daily-menu ("Pranzo") popup. The menu content is
 * an authored FRAGMENT (default path /menu, overridable by an authored cell),
 * so the kitchen edits one document per day. The block loads it and wraps it in
 * a dismissible modal. Not re-shown once dismissed this session. CSP-safe: the
 * close handler is wired here in block JS (#20, D12).
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  // optional authored override of the fragment path; default /menu
  const authored = block.textContent.trim();
  const path = authored && authored.startsWith('/') ? authored : '/menu';
  block.textContent = '';

  const fragment = await loadFragment(path);

  const card = document.createElement('div');
  card.className = 'menu-card';

  const close = document.createElement('button');
  close.className = 'menu-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Schliessen');
  close.textContent = '×';
  card.append(close);

  if (fragment) {
    // MOVE the authored menu elements into the card (EW1)
    [...fragment.querySelectorAll(':scope > div > *')].forEach((el) => card.append(el));
  }

  const modal = document.createElement('div');
  modal.className = 'menu-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Tagesmenü');
  modal.append(card);

  block.append(modal);

  // Auto-shows on every homepage load; dismiss closes it for the current view
  // only (no persistence) so it reliably greets each visit.
  const dismiss = () => { modal.hidden = true; };
  close.addEventListener('click', dismiss);
  modal.addEventListener('click', (e) => { if (e.target === modal) dismiss(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dismiss(); });
}
