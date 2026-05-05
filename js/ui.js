// Purpose: shared UI helpers. Callers: cart/pages/navigation. Deps: DOM. API: showToast, fmt, genOrderId, markActiveNav, initCommonPage. Side effects: DOM toast/nav badge.
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(10px);
      background:var(--brown);color:#fff;padding:.7rem 1.5rem;border-radius:100px;
      font-size:.875rem;font-weight:500;z-index:999;opacity:0;transition:all .3s;
      box-shadow:0 4px 16px rgba(62,31,0,.3);pointer-events:none;white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2200);
}

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function genOrderId() {
  return 'KN-' + Date.now().toString(36).toUpperCase().slice(-6);
}

function markActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
  });
}

function initCommonPage() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
  markActiveNav();
  updateBadge();
}
