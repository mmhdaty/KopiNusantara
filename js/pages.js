// Purpose: page-specific renderers. Callers: main/navigation. Deps: data/cart/ui/navigation. API: initPageSpecific, submitContact, showHeroPlaceholder, renderCart. Side effects: DOM render, localStorage order.
function showHeroPlaceholder() {
  document.getElementById('heroPhotoWrap').style.display = 'none';
  document.getElementById('heroPlaceholder').style.display = 'flex';
}

function initIndexPage() {
  const photoWrap = document.getElementById('heroPhotoWrap');
  const photo = document.getElementById('heroPhoto');
  const placeholder = document.getElementById('heroPlaceholder');
  if (!photoWrap || !photo || !placeholder) return;
  placeholder.style.display = 'none';
  photoWrap.style.display = 'block';
  photo.src = '1 latte.jpeg';
}

function initMenuPage() {
  const bestSellerGrid = document.getElementById('bestSellerGrid');
  const menuGrid = document.getElementById('menuGrid');
  if (!bestSellerGrid || !menuGrid) return;
  let activeFilter = 'all';
  const makeCard = (item, isBestSeller = false) => `
    <div class="card">
      ${isBestSeller ? '<span class="best-seller-badge">⭐ Best Seller</span>' : ''}
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.name}" class="card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
        <div class="card-img-fallback">☕</div>
      </div>
      <div class="card-name">${item.name}</div>
      <div class="card-desc">${item.desc}</div>
      <div class="card-footer">
        <span class="card-price">${fmt(item.price)}</span>
        <button class="add-btn" onclick="addToCart(${item.id})">+</button>
      </div>
    </div>`;
  const renderMenu = () => {
    const items = activeFilter === 'all' ? menu : menu.filter(m => m.cat === activeFilter);
    menuGrid.innerHTML = items.map(item => makeCard(item, bestSellerIds.includes(item.id))).join('');
  };
  bestSellerGrid.innerHTML = bestSellerIds.map(id => {
    const item = menu.find(m => m.id === id);
    return item ? makeCard(item, true) : '';
  }).join('');
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.cat;
      renderMenu();
    });
  });
  renderMenu();
}

function initCartPage() {
  const list = document.getElementById('cartList');
  const summaryItems = document.getElementById('summaryItems');
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!list || !summaryItems || !checkoutBtn) return;

  const createEmptyEl = () => {
    const div = document.createElement('div');
    div.className = 'empty';
    div.id = 'cartEmpty';
    div.innerHTML = '<span>🛒</span><p style="font-weight:600;font-size:1rem;margin-bottom:.4rem;">Keranjangmu masih kosong</p><p style="font-size:.875rem;">Yuk, tambahkan menu favoritmu!</p><a href="menu.html" class="btn" style="margin-top:1rem;display:inline-block;">Lihat Menu →</a>';
    return div;
  };
  const updateSummary = subtotal => {
    const tax = Math.round(subtotal * 0.1);
    document.getElementById('subtotal').textContent = fmt(subtotal);
    document.getElementById('tax').textContent = fmt(tax);
    document.getElementById('total').textContent = fmt(subtotal + tax);
  };

  window.renderCart = () => {
    const cart = getCart();
    document.getElementById('cartBadge').textContent = cart.reduce((s, c) => s + c.qty, 0);
    if (cart.length === 0) {
      list.innerHTML = '';
      list.appendChild(document.getElementById('cartEmpty') || createEmptyEl());
      summaryItems.innerHTML = '<p style="font-size:.85rem;color:var(--muted);text-align:center;padding:.75rem 0;">Belum ada item</p>';
      updateSummary(0);
      return;
    }
    list.innerHTML = cart.map(c => `
      <div class="cart-item">
        <img src="${c.img}" alt="${c.name}" class="ci-img" onerror="this.style.display='none'"/>
        <div class="ci-info"><div class="ci-name">${c.name}</div><div class="ci-price">${fmt(c.price)} / item</div></div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${c.id},-1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
          <button class="del-btn" onclick="removeItem(${c.id})" title="Hapus">🗑</button>
        </div>
      </div>`).join('');
    summaryItems.innerHTML = cart.map(c => `<div class="summary-item"><span class="item-name">${c.name} ×${c.qty}</span><span>${fmt(c.price * c.qty)}</span></div>`).join('');
    updateSummary(cart.reduce((s, c) => s + c.price * c.qty, 0));
  };

  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) { showToast('Keranjang masih kosong!'); return; }
    const name = document.getElementById('nameInput').value.trim();
    if (!name) { document.getElementById('nameInput').focus(); showToast('Masukkan nama pemesan terlebih dahulu'); return; }
    const method = document.querySelector('input[name="pay"]:checked').value;
    const note = document.getElementById('noteInput').value.trim();
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const tax = Math.round(subtotal * 0.1);
    localStorage.setItem('kn_order', JSON.stringify({ id: genOrderId(), name, method, note, items: cart, subtotal, tax, total: subtotal + tax, status: 'unpaid', createdAt: new Date().toISOString() }));
    saveCart([]);
    softNavigate('pembayaran.html').catch(() => { location.href = 'pembayaran.html'; });
  });
  window.renderCart();
}

function initPaymentPage() {
  const receiptCard = document.getElementById('receiptCard');
  if (!receiptCard) return;
  const fmtDate = iso => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }) + ' · ' + d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  };
  const methodIcon = m => ({ Cash:'💵', Transfer:'🏦', QRIS:'📱' }[m] || '💳') + ' ' + (m || '—');
  const statusLabel = s => ({ unpaid:'Belum Bayar', paid:'Sudah Dibayar', received:'Pesanan Diterima' }[s] || s);
  const renderReceipt = () => {
    const raw = localStorage.getItem('kn_order');
    if (!raw) {
      document.getElementById('emptyOrder').style.display = 'block';
      receiptCard.style.display = 'none';
      document.getElementById('payActions').style.display = 'none';
      return;
    }
    const o = JSON.parse(raw);
    receiptCard.style.display = 'block';
    document.getElementById('payActions').style.display = 'flex';
    document.getElementById('emptyOrder').style.display = 'none';
    document.getElementById('rOrderId').textContent = '#' + (o.id || 'KN-000000');
    const pill = document.getElementById('rStatusPill');
    pill.textContent = statusLabel(o.status);
    pill.classList.toggle('paid', o.status === 'paid' || o.status === 'received');
    document.getElementById('rName').textContent = o.name || '—';
    document.getElementById('rMethod').textContent = methodIcon(o.method);
    document.getElementById('rTime').textContent = fmtDate(o.createdAt);
    document.getElementById('rStatus').textContent = statusLabel(o.status);
    if (o.note) {
      document.getElementById('rNoteWrap').style.display = '';
      document.getElementById('rNote').textContent = o.note;
    }
    const itemsEl = document.getElementById('rItems');
    itemsEl.innerHTML = o.items && o.items.length ? o.items.map(item => `
      <div class="item-row"><div class="item-row-left">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="item-img" onerror="this.style.display='none'">` : '<div class="item-img-placeholder">☕</div>'}
        <div><div class="item-name">${item.name}</div><div class="item-qty">${fmt(item.price)} × ${item.qty}</div></div>
      </div><div class="item-price">${fmt(item.price * item.qty)}</div></div>`).join('') : '<p style="font-size:.85rem;color:var(--muted);text-align:center;padding:.5rem 0;">Tidak ada item</p>';
    document.getElementById('rSubtotal').textContent = fmt(o.subtotal || 0);
    document.getElementById('rTax').textContent = fmt(o.tax || 0);
    document.getElementById('rTotal').textContent = fmt(o.total || 0);
    const btnConfirm = document.getElementById('btnConfirm');
    if (o.status === 'unpaid') {
      btnConfirm.style.display = 'block';
      btnConfirm.addEventListener('click', () => {
        o.status = 'paid';
        localStorage.setItem('kn_order', JSON.stringify(o));
        renderReceipt();
        showToast('Pembayaran dikonfirmasi! ✅');
      }, { once: true });
    } else btnConfirm.style.display = 'none';
  };
  renderReceipt();
}

function submitContact(e) {
  e.preventDefault();
  showToast('Pesan terkirim! Kami akan segera menghubungimu ☕');
  e.target.reset();
}

function initPageSpecific() {
  initIndexPage();
  initMenuPage();
  initCartPage();
  initPaymentPage();
}
