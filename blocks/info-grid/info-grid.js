/**
 * info-grid — the contact-details strip on the Kontakt page. One row per cell;
 * each cell is authored as a heading (Adresse / Telefon / E-Mail / Öffnungszeiten)
 * followed by its value paragraphs. The block maps the heading to a line icon and
 * MOVES the authored elements into a bordered cell (EW1).
 *
 * @param {Element} block
 */
const ICONS = {
  adresse: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  telefon: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 18v-4l-5-2"/>',
  'e-mail': '<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>',
  'öffnungszeiten': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};

function iconFor(label) {
  const key = Object.keys(ICONS).find((k) => label.toLowerCase().startsWith(k));
  return key ? ICONS[key] : '';
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'ig-grid';

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const out = document.createElement('div');
    out.className = 'ig-cell';

    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    const paths = iconFor(heading ? heading.textContent.trim() : '');
    if (paths) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.4');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = paths;
      out.append(svg);
    }

    // MOVE all authored children (heading + value paragraphs) into the cell
    [...cell.childNodes].forEach((n) => out.append(n));
    grid.append(out);
  });

  block.append(grid);
}
