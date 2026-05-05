// Purpose: soft navigation preserving audio. Callers: main/page checkout. Deps: ui.js, pages.js. API: softNavigate, initSoftNavigation. Side effects: history, body/head DOM swaps.
function syncPageHead(doc) {
  document.title = doc.title;
  document.querySelectorAll('[data-soft-nav-style]').forEach(el => el.remove());
  doc.head.querySelectorAll('style').forEach(style => {
    const clone = style.cloneNode(true);
    clone.dataset.softNavStyle = 'true';
    document.head.appendChild(clone);
  });
}

async function softNavigate(url, pushState = true) {
  const audio = document.getElementById('bgAudio');
  const player = document.getElementById('audioPlayer');
  const response = await fetch(url);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  syncPageHead(doc);
  document.body.innerHTML = doc.body.innerHTML;
  if (audio && player) document.body.prepend(audio, player);
  if (pushState) history.pushState({}, '', url);
  initCommonPage();
  initPageSpecific();
  scrollTo(0, 0);
}

function initSoftNavigation() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
    e.preventDefault();
    softNavigate(url.href).catch(() => { location.href = url.href; });
  });
  window.addEventListener('popstate', () => softNavigate(location.href, false));
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
  });
}
