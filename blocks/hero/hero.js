/**
 * hero — Restaurant zum Rebhaus signature hero: the brushstroke logo over
 * full-bleed food photography. Two variants:
 *   default        — single static photo (Säle page)
 *   .hero.slideshow — auto-advancing fullscreen photo slideshow (home)
 *
 * Images are FIXED brand assets referenced root-relative from block code
 * (#67), not authored content. Authoring: an empty <div class="hero"> (or
 * class="hero slideshow"). No authored text — a purely visual signature block.
 *
 * @ew-exempt all — decorative signature hero, no authored text
 * @param {Element} block
 */
const SLIDES = [
  '/img/rebhaus/hero-1.jpg', '/img/rebhaus/hero-2.jpg', '/img/rebhaus/hero-3.jpg',
  '/img/rebhaus/hero-4.jpg', '/img/rebhaus/hero-5.jpg', '/img/rebhaus/hero-6.jpg',
  '/img/rebhaus/hero-7.jpg', '/img/rebhaus/hero-8.jpg', '/img/rebhaus/hero-9.jpg',
  '/img/rebhaus/hero-10.jpg',
];

export default function decorate(block) {
  const isSlideshow = block.classList.contains('slideshow');
  const imgs = isSlideshow ? SLIDES : [SLIDES[0]];

  block.textContent = '';
  const stage = document.createElement('div');
  stage.className = 'hero-stage';

  imgs.forEach((src, i) => {
    const fig = document.createElement('figure');
    if (i === 0) fig.classList.add('active');
    fig.style.backgroundImage = `url("${src}")`;
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

  if (isSlideshow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
