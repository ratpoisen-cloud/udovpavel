// ——— Executive Sales CV · только используемая логика ———
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileMenu();
  initThemeToggle();
  initAvatarRotation();
  initGallery();
  initToTop();
});

function initYear() {
  $('#year').textContent = new Date().getFullYear();
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
  if (photos.length < 2) return;
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

/* наверх */
function initToTop() {
  const btn = $('#toTop');
  if (!btn) return;
  btn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
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
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
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
}
