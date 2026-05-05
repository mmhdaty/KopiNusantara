// Purpose: cart persistence and actions. Callers: page modules, inline button handlers. Deps: data.js, ui.js. API: getCart, saveCart, addToCart, changeQty, removeItem, updateBadge. Side effects: localStorage, DOM badge.
function getCart() {
  try { return JSON.parse(localStorage.getItem('kn_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('kn_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  const item = menu.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  updateBadge();
  showToast(`${item.name} ditambahkan ke keranjang 🛒`);
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
  updateBadge();
}

function removeItem(id) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
  updateBadge();
}

function updateBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.textContent = getCart().reduce((s, c) => s + c.qty, 0);
}
