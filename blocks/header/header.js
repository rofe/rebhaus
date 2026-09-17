import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — centered floating nav pill for Restaurant zum Rebhaus.
 * Loads the /nav fragment (a single list of links) and renders it as a
 * centered white pill that floats over the page. Simple wrap on mobile —
 * no hamburger needed for 5 short links.
 * @param {Element} block
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Hauptnavigation');

  const pill = document.createElement('div');
  pill.className = 'nav-pill';

  // move every authored link (from the /nav fragment) into the pill,
  // preserving the authored <a> nodes (EW1)
  if (fragment) {
    [...fragment.querySelectorAll('a')].forEach((a) => pill.append(a));
  }

  // mark the current page's link
  const here = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  pill.querySelectorAll('a').forEach((a) => {
    const target = new URL(a.href, window.location).pathname.replace(/\/$/, '') || '/';
    if (target === here) a.setAttribute('aria-current', 'page');
  });

  nav.append(pill);
  block.append(nav);
}
