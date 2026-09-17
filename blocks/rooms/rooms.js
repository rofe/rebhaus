/**
 * rooms — the three banquet rooms on the Säle page. One row per room:
 *   cell 1: room name as an emphasis-wrapped link (→ a.button.secondary) to its photo
 *   cell 2: capacity line (body text)
 * Authoring — one row per room, three cells:
 *   1. emblem image (authored <img>/<picture> — the distinct green mark; editable)
 *   2. room name as an emphasis-wrapped link (→ a.button.secondary) to its photo
 *   3. capacity line (body text)
 * The emblem is now authored content (EW1: moved, not rebuilt) so an editor can
 * swap it. A name-based default asset is used only if a row authors no image.
 *
 * schema: stardust/eds-schema/saele.json (rooms group, 3 uniform units)
 * @param {Element} block
 */
function defaultEmblem(name) {
  const n = name.toLowerCase();
  if (/stube|vorgesetz/.test(n)) return '/img/rebhaus/emblem-stube.png';
  if (/sääli|saeaeli|sali/.test(n)) return '/img/rebhaus/emblem-saeaeli.png';
  return '/img/rebhaus/emblem-saal.png';
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'rooms-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'room';

    // classify cells by content (order-tolerant): media, the name link, capacity
    let media = null;
    let link = null;
    let capCell = null;
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture, img');
      const a = cell.querySelector('a');
      if (pic && !media) media = pic;
      else if (a && !link) link = a;
      else capCell = cell;
    });

    // emblem — MOVE the authored image (EW1); fall back to a default asset
    const wrap = document.createElement('div');
    wrap.className = 'room-emblem';
    if (media) {
      media.classList.add('emblem');
      wrap.append(media);
    } else {
      const img = document.createElement('img');
      img.className = 'emblem';
      img.src = defaultEmblem(link ? link.textContent : '');
      img.alt = '';
      wrap.append(img);
    }
    // hover-reveal: the room photo (the name link's target) fades in over the emblem
    if (link && link.getAttribute('href')) {
      const photo = document.createElement('img');
      photo.className = 'room-photo';
      photo.src = link.getAttribute('href');
      photo.alt = '';
      // eager so the hover swap is instant (a hidden lazy image never loads)
      wrap.append(photo);
    }
    card.append(wrap);

    if (link) card.append(link.closest('p') || link);

    if (capCell) {
      const cap = capCell.firstElementChild || capCell;
      cap.classList.add('room-cap');
      card.append(cap);
    }

    grid.append(card);
  });

  block.append(grid);
}
