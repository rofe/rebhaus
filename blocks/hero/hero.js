/**
 * hero — Restaurant zum Rebhaus signature hero: the brushstroke logo over
 * full-bleed food photography. Two variants:
 *   default        — single static photo (Säle page)
 *   .hero.slideshow — auto-advancing fullscreen photo slideshow (home)
 *
 * The photos are AUTHORED inline images (one per row) — DA-hosted editorial
 * content the pipeline ingests. The logo is the one fixed brand asset kept on
 * the code bus (#67), root-relative.
 *
 * @ew-exempt img — decorative signature imagery, no authored text
 * @param {Element} block
 */
export default function decorate(block) {
  const isSlideshow = block.classList.contains('slideshow');

  // collect authored images (pipeline delivers each as <picture><img></picture>)
  const media = [...block.querySelectorAll('picture, img')]
    // keep only outermost (a <picture> wraps its <img>)
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')));
  const frames = isSlideshow ? media : media.slice(0, 1);

  block.textContent = '';
  const stage = document.createElement('div');
  stage.className = 'hero-stage';

  frames.forEach((el, i) => {
    const fig = document.createElement('figure');
    if (i === 0) fig.classList.add('active');
    const img = el.querySelector?.('img') || el;
    if (i === 0) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
    fig.append(el);
    stage.append(fig);
  });

  const logo = document.createElement('div');
  logo.className = 'hero-logo';
  const img = document.createElement('img');
  img.src = '/img/rebhaus/logo-weiss.png';
  img.alt = 'Restaurant zum Rebhaus';
  img.loading = 'eager';
  img.setAttribute('fetchpriority', 'high');
  logo.append(img);

  block.append(stage, logo);

  if (isSlideshow && frames.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const figs = [...stage.children];
    let i = 0;
    const advance = () => {
      figs[i].classList.remove('active');
      i = (i + 1) % figs.length;
      figs[i].classList.add('active');
    };
    setInterval(advance, 5000);
  }
}
