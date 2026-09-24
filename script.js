// ——— Executive Sales CV · только используемая логика ———
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initHeader();
  initMobileMenu();
  initThemeToggle();
  initAvatarRotation();
  initReveal();
  initCounters();
  initActiveNav();
  initGallery();
  initToTop();
});

function initYear() {
  $('#year').textContent = new Date().getFullYear();
}

function initHeader() {
  const header = $('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', scrollY > 8);
  update();
  addEventListener('scroll', update, { passive: true });
}

/* мобильное меню */
function initMobileMenu() {
  const burger = $('#burger'), nav = $('#nav');
  if (!burger || !nav) return;
  burger.onclick = () => {
    const open = nav.classList.toggle('open');
    burger.children[0].style.transform = open ? 'rotate(45deg) translateY(3.5px)' : '';
    burger.children[1].style.transform = open ? 'rotate(-45deg) translateY(-3.5px)' : '';
  };
  nav.onclick = e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.children[0].style.transform = '';
      burger.children[1].style.transform = '';
    }
  };
}

/* тема */
function initThemeToggle() {
  const themeBtn = $('#themeBtn');
  if (!themeBtn) return;
  const savedTheme = localStorage.getItem('cv-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeBtn.onclick = () => {
    const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = cur;
    localStorage.setItem('cv-theme', cur);
  };
}

function initAvatarRotation() {
  const container = $('#profilePhoto');
  if (!container) return;
  const photos = $$('.avatar-slide', container);
  if (photos.length < 2 || reduceMotion) return;
  let index = 0;
  const showNext = () => {
    const previous = photos[index];
    index = (index + 1) % photos.length;
    const next = photos[index];
    previous.classList.remove('is-active');
    next.classList.add('is-active');
  };
  setInterval(showNext, 5000);
}

function initReveal() {
  const elements = $$('.hero-copy > *, .hero-photo, .section-heading, .scope-item, .experience-item, .competency-group, .s-item, .edu-item, .contact-grid');
  if (!elements.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -24px' });
  elements.forEach((el, index) => {
    el.classList.add('reveal-item');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`);
    io.observe(el);
  });
}

function initCounters() {
  const numbers = $$('.fact strong, .speaking-number');
  if (!numbers.length || reduceMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const source = el.dataset.count || el.textContent.replace(/[^\d]/g, '');
      const end = Number(source);
      if (!Number.isFinite(end)) return;
      const suffix = el.textContent.replace(/[\d\s]/g, '');
      const duration = 900;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: .6 });
  numbers.forEach(el => io.observe(el));
}

function initActiveNav() {
  const links = $$('.main-nav a');
  const sections = links.map(link => $(link.getAttribute('href'))).filter(Boolean);
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65%', threshold: 0 });
  sections.forEach(section => io.observe(section));
}

/* наверх */
function initToTop() {
  const btn = $('#toTop');
  if (!btn) return;
  btn.onclick = () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* лайтбокс выступлений */
function initGallery() {
  const gItems = $$('.s-item');
  const lightbox = $('#lightbox');
  if (!gItems.length || !lightbox) return;
  const lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  let lbIndex = 0;

  function openLb(i) {
    lbIndex = (i + gItems.length) % gItems.length;
    const img = gItems[lbIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = gItems[lbIndex].querySelector('figcaption')?.textContent || '';
    lbCount.textContent = (lbIndex + 1) + ' / ' + gItems.length;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  gItems.forEach((it, i) => it.addEventListener('click', () => openLb(i)));
  $('#lbClose').onclick = closeLb;
  $('#lbPrev').onclick = e => { e.stopPropagation(); openLb(lbIndex - 1); };
  $('#lbNext').onclick = e => { e.stopPropagation(); openLb(lbIndex + 1); };
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
    if (e.key === 'ArrowRight') openLb(lbIndex + 1);
  });
  lightbox.setAttribute('aria-hidden', 'true');
}
