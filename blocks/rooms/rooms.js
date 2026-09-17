/**
 * rooms — the three banquet rooms on the Säle page. One row per room, cells:
 *   1. emblem image   (authored <img> — the green line mark; passive state)
 *   2. room name      (text — styled as an outline label, non-navigating)
 *   3. capacity line  (body text)
 *   4. room photo     (authored <img> — revealed on hover, same box as emblem)
 * All imagery is DA-hosted authored content the pipeline ingests. Emblem and
 * photo share one fixed box and crossfade on hover — no layout shift.
 *
 * @param {Element} block
 */
const outer = (els) => els.filter((el) => !(el.tagName === 'IMG' && el.closest('picture')));

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'rooms-grid';

  rows.forEach((row) => {
    const imgs = outer([...row.querySelectorAll('picture, img')]);
    const textCells = [...row.children].filter((c) => !c.querySelector('picture, img') && c.textContent.trim());
    const capCell = textCells.find((c) => /kapazit/i.test(c.textContent));
    const nameCell = textCells.find((c) => c !== capCell);

    const card = document.createElement('div');
    card.className = 'room';

    // media box: emblem (passive) + photo (hover), same dimensions
    const box = document.createElement('div');
    box.className = 'room-emblem';
    if (imgs[0]) { imgs[0].classList.add('emblem'); box.append(imgs[0]); }
    if (imgs[1]) { imgs[1].classList.add('room-photo'); box.append(imgs[1]); }
    card.append(box);

    // room name — non-navigating outline label
    if (nameCell) {
      const name = document.createElement('div');
      name.className = 'room-name';
      name.append(...nameCell.childNodes);
      card.append(name);
    }

    if (capCell) {
      const cap = capCell.firstElementChild || capCell;
      cap.classList.add('room-cap');
      card.append(cap);
    }

    grid.append(card);
  });

  block.append(grid);
}
