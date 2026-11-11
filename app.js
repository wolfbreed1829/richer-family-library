document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

function closeMenu(returnFocus = false) {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton?.focus();
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation?.classList.toggle('is-open', open);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});

document.addEventListener('click', event => {
  if (event.target instanceof Element && !event.target.closest('.site-header')) closeMenu();
});

navigation?.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('a')) closeMenu();
});

window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = String(new Date().getFullYear());
});

const scan = document.querySelector('#article-scan');
const scanViewport = document.querySelector('#scan-viewport');
const zoomButton = document.querySelector('.zoom-button');

function resetScanZoom() {
  scanViewport?.classList.remove('is-zoomed');
  zoomButton?.setAttribute('aria-pressed', 'false');
  if (zoomButton) zoomButton.textContent = 'Enlarge';
  scanViewport?.scrollTo(0, 0);
}

document.querySelectorAll('[data-scan]').forEach(link => {
  link.addEventListener('click', event => {
    if (!scan || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scan.src = link.getAttribute('href');
    scan.alt = link.dataset.alt;
    document.querySelector('#scan-original').href = link.getAttribute('href');
    document.querySelectorAll('[data-scan]').forEach(item => item.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'page');
    document.querySelector('#scan-status').textContent = `Showing newspaper page ${link.dataset.page}`;
    resetScanZoom();
  });
});

zoomButton?.addEventListener('click', () => {
  const enlarged = zoomButton.getAttribute('aria-pressed') !== 'true';
  zoomButton.setAttribute('aria-pressed', String(enlarged));
  zoomButton.textContent = enlarged ? 'Fit to screen' : 'Enlarge';
  scanViewport?.classList.toggle('is-zoomed', enlarged);
  scanViewport?.scrollTo(0, 0);
});
