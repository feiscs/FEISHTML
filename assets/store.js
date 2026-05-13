const defaultProducts = [
  {
    id: 'linen-trench',
    name: 'Trench Lino Arena',
    category: 'Prendas',
    price: 148,
    oldPrice: 188,
    rating: 4.9,
    badge: '-20%',
    createdAt: 8,
    description: 'Trench liviano de lino premium con caída relajada, bolsillos amplios y acabado repelente al agua.',
    colors: ['Arena', 'Oliva', 'Negro'],
    sizes: ['XS', 'S', 'M', 'L'],
    bg: '#ead9c3',
    gradient: 'linear-gradient(145deg, #d8b894, #f8ecdc 48%, #77624b 49%, #b96f4f)',
    shape: '44% 44% 1.2rem 1.2rem',
  },
  {
    id: 'arc-bag',
    name: 'Bolso Arc Cognac',
    category: 'Bolsos',
    price: 96,
    oldPrice: null,
    rating: 4.8,
    badge: 'Nuevo',
    createdAt: 10,
    description: 'Bolso estructurado con asa curva, cierre magnético y compartimento interior para básicos diarios.',
    colors: ['Cognac', 'Crema', 'Chocolate'],
    sizes: ['Única'],
    bg: '#e8c9aa',
    gradient: 'radial-gradient(circle at 50% 18%, #fff1df 0 18%, transparent 19%), linear-gradient(160deg, #8a5136, #c48763)',
    shape: '48% 48% 18% 18%',
  },
  {
    id: 'ribbed-set',
    name: 'Set Rib Studio',
    category: 'Prendas',
    price: 82,
    oldPrice: 104,
    rating: 4.7,
    badge: '-21%',
    createdAt: 6,
    description: 'Conjunto ribbed de dos piezas con textura suave, cintura alta y fit cómodo para todo el día.',
    colors: ['Marfil', 'Topo', 'Grafito'],
    sizes: ['S', 'M', 'L'],
    bg: '#eee4d6',
    gradient: 'repeating-linear-gradient(90deg, #f7efe4 0 8px, #ddcbb7 8px 13px)',
    shape: '1.1rem',
  },
  {
    id: 'ceramic-vase',
    name: 'Jarrón Forma 02',
    category: 'Hogar',
    price: 58,
    oldPrice: null,
    rating: 4.9,
    badge: 'Nuevo',
    createdAt: 9,
    description: 'Pieza cerámica hecha a mano con silueta orgánica y esmalte mate para espacios minimalistas.',
    colors: ['Crudo', 'Terracota'],
    sizes: ['S', 'M'],
    bg: '#e7ddcd',
    gradient: 'linear-gradient(145deg, #fff8ec, #c89b77)',
    shape: '50% 50% 34% 34%',
  },
  {
    id: 'silk-scarf',
    name: 'Pañuelo Seda Grid',
    category: 'Accesorios',
    price: 44,
    oldPrice: null,
    rating: 4.6,
    badge: 'Limited',
    createdAt: 7,
    description: 'Pañuelo de seda con patrón geométrico, bordes enrollados y acabado satinado.',
    colors: ['Marfil', 'Azul', 'Caramelo'],
    sizes: ['Única'],
    bg: '#dde1d2',
    gradient: 'linear-gradient(45deg, #fff 0 25%, #6f7758 25% 50%, #d7a075 50% 75%, #fff 75%)',
    shape: '0.8rem',
  },
  {
    id: 'leather-belt',
    name: 'Cinturón Nudo',
    category: 'Accesorios',
    price: 52,
    oldPrice: 68,
    rating: 4.7,
    badge: '-24%',
    createdAt: 5,
    description: 'Cinturón en cuero vegetal con hebilla escultural y costuras tono sobre tono.',
    colors: ['Negro', 'Cognac'],
    sizes: ['S', 'M', 'L'],
    bg: '#dcc7ae',
    gradient: 'linear-gradient(90deg, #2a211b 0 22%, #b96f4f 22% 78%, #2a211b 78%)',
    shape: '999px',
  },
  {
    id: 'weekend-tote',
    name: 'Tote Weekend',
    category: 'Bolsos',
    price: 112,
    oldPrice: null,
    rating: 4.8,
    badge: 'Nuevo',
    createdAt: 11,
    description: 'Tote amplio de canvas encerado con correas de cuero y bolsillo para laptop de 14 pulgadas.',
    colors: ['Canvas', 'Oliva', 'Negro'],
    sizes: ['Única'],
    bg: '#e2d3bf',
    gradient: 'linear-gradient(160deg, #efe4d4 0 45%, #6f7758 46% 75%, #2b2923 76%)',
    shape: '1rem 1rem 2rem 2rem',
  },
  {
    id: 'scent-candle',
    name: 'Vela Santal 300g',
    category: 'Hogar',
    price: 38,
    oldPrice: 48,
    rating: 4.5,
    badge: '-20%',
    createdAt: 4,
    description: 'Vela aromática de santal, ámbar y cedro en vaso reusable de vidrio ahumado.',
    colors: ['Ámbar', 'Humo'],
    sizes: ['300g'],
    bg: '#eadfd0',
    gradient: 'linear-gradient(180deg, #fff1c7 0 12%, #37312c 13% 100%)',
    shape: '0.5rem 0.5rem 1.2rem 1.2rem',
  },
];

let products = [...defaultProducts];

const store = {
  state: {
    cart: [],
    wishlist: [],
    filter: 'all',
    sort: 'newest',
    compact: false,
    search: '',
    selectedProduct: null,
    selectedSize: null,
    selectedColor: null,
  },
  set(partial) {
    this.state = { ...this.state, ...partial };
    render();
  },
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[char]));
const productGrid = document.querySelector('[data-product-grid]');
const emptyState = document.querySelector('[data-empty-state]');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const wishlistDrawer = document.querySelector('[data-wishlist-drawer]');
const modal = document.querySelector('[data-product-modal]');
const modalContent = document.querySelector('[data-modal-content]');

function visibleProducts() {
  const query = store.state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = store.state.filter === 'all' || product.category === store.state.filter;
    const queryMatch = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });

  return filtered.sort((a, b) => {
    if (store.state.sort === 'price-asc') return a.price - b.price;
    if (store.state.sort === 'price-desc') return b.price - a.price;
    if (store.state.sort === 'rating') return b.rating - a.rating;
    return b.createdAt - a.createdAt;
  });
}

function productStyle(product) {
  return `--product-bg:${product.bg};--thumb-bg:${product.bg};--modal-bg:${product.bg};--product-gradient:${product.gradient};--shape:${product.shape};`;
}

function productMedia(product) {
  return product.image
    ? `<img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" />`
    : '<div class="product-visual" aria-hidden="true"></div>';
}

function renderProducts() {
  const list = visibleProducts();
  productGrid.classList.toggle('is-compact', store.state.compact);
  emptyState.hidden = list.length > 0;

  productGrid.innerHTML = list.map((product) => {
    const isFavorite = store.state.wishlist.includes(product.id);
    return `
      <article class="product-card" style="${productStyle(product)}">
        <div class="product-media">
          <span class="badge">${escapeHTML(product.badge)}</span>
          <button class="favorite-btn ${isFavorite ? 'is-active' : ''}" type="button" data-favorite="${escapeHTML(product.id)}" aria-label="Agregar ${escapeHTML(product.name)} a favoritos">${isFavorite ? '♥' : '♡'}</button>
          ${productMedia(product)}
          <button class="btn btn-dark quick-add" type="button" data-quick-add="${escapeHTML(product.id)}">Quick Add</button>
        </div>
        <div class="product-info">
          <div class="product-top">
            <h3>${escapeHTML(product.name)}</h3>
            <span class="rating">★ ${product.rating}</span>
          </div>
          <p>${escapeHTML(product.description)}</p>
          <div class="price-line">
            <span><strong>${money.format(product.price)}</strong> ${product.oldPrice ? `<s>${money.format(product.oldPrice)}</s>` : ''}</span>
            <button class="detail-link" type="button" data-open-product="${escapeHTML(product.id)}">Ver detalle</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function addToCart(productId, options = {}) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const size = options.size || product.sizes[0];
  const color = options.color || product.colors[0];
  const key = `${productId}-${size}-${color}`;
  const existing = store.state.cart.find((item) => item.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    store.state.cart.push({ ...product, key, size, color, quantity: 1 });
  }

  render();
  window.FormaIntegrations?.trackEvent('cart_add', { productId, size, color, price: product.price });
  openDrawer(cartDrawer);
}

function changeQuantity(key, amount) {
  const item = store.state.cart.find((cartItem) => cartItem.key === key);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    store.state.cart = store.state.cart.filter((cartItem) => cartItem.key !== key);
  }
  render();
}

function toggleFavorite(productId) {
  const exists = store.state.wishlist.includes(productId);
  store.state.wishlist = exists
    ? store.state.wishlist.filter((id) => id !== productId)
    : [...store.state.wishlist, productId];
  render();
}

function renderCart() {
  const cartItems = document.querySelector('[data-cart-items]');
  const count = store.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = store.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingTarget = 100;
  const remaining = Math.max(freeShippingTarget - subtotal, 0);
  const shipping = subtotal === 0 ? 8 : remaining > 0 ? 8 : 0;
  const progress = Math.min((subtotal / freeShippingTarget) * 100, 100);

  document.querySelector('[data-cart-count]').textContent = count;
  document.querySelector('[data-subtotal]').textContent = money.format(subtotal);
  document.querySelector('[data-shipping-cost]').textContent = shipping === 0 ? 'Gratis' : money.format(shipping);
  document.querySelector('[data-total]').textContent = money.format(subtotal + shipping);
  document.querySelector('[data-shipping-progress]').style.width = `${progress}%`;
  document.querySelector('[data-shipping-copy]').textContent = subtotal === 0
    ? 'Agrega productos para desbloquear envío gratis.'
    : remaining > 0
      ? `Te faltan ${money.format(remaining)} para envío gratis.`
      : '¡Desbloqueaste envío gratis!';

  if (!store.state.cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Tu bolsa está vacía. Agrega tus favoritos para empezar.</p>';
    return;
  }

  cartItems.innerHTML = store.state.cart.map((item) => `
    <article class="line-item" style="${productStyle(item)}">
      <div class="line-thumb" aria-hidden="true"></div>
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.color)} · ${escapeHTML(item.size)} · ${money.format(item.price)}</p>
        <div class="qty">
          <button type="button" data-qty="${escapeHTML(item.key)}" data-amount="-1">−</button>
          <strong>${item.quantity}</strong>
          <button type="button" data-qty="${escapeHTML(item.key)}" data-amount="1">+</button>
        </div>
      </div>
      <strong>${money.format(item.price * item.quantity)}</strong>
    </article>
  `).join('');
}

function renderWishlist() {
  document.querySelector('[data-wishlist-count]').textContent = store.state.wishlist.length;
  const wishlistItems = document.querySelector('[data-wishlist-items]');
  const list = store.state.wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  wishlistItems.innerHTML = list.length
    ? list.map((product) => `
      <article class="line-item" style="${productStyle(product)}">
        <div class="line-thumb" aria-hidden="true"></div>
        <div><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.category)} · ${money.format(product.price)}</p></div>
        <button class="detail-link" type="button" data-open-product="${escapeHTML(product.id)}">Ver</button>
      </article>
    `).join('')
    : '<p class="cart-empty">Aún no tienes favoritos.</p>';
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  store.state.selectedProduct = product.id;
  store.state.selectedSize = product.sizes[0];
  store.state.selectedColor = product.colors[0];
  renderModal();
  modal.showModal();
  document.body.classList.add('is-locked');
}

function renderModal() {
  const product = products.find((item) => item.id === store.state.selectedProduct);
  if (!product) return;

  modalContent.innerHTML = `
    <div class="modal-gallery" style="${productStyle(product)}">
      <div class="modal-hero">${productMedia(product)}</div>
      <div class="thumbs">
        <button type="button" aria-label="Vista frontal"></button>
        <button type="button" aria-label="Detalle de textura"></button>
        <button type="button" aria-label="Vista editorial"></button>
      </div>
    </div>
    <div class="modal-copy">
      <p class="eyebrow">${escapeHTML(product.category)}</p>
      <h2>${escapeHTML(product.name)}</h2>
      <p>${escapeHTML(product.description)}</p>
      <p class="price-line"><strong>${money.format(product.price)}</strong> ${product.oldPrice ? `<s>${money.format(product.oldPrice)}</s>` : ''}</p>
      <div class="option-group">
        <strong>Talla</strong>
        <div class="option-list">
          ${product.sizes.map((size) => `<button class="${store.state.selectedSize === size ? 'is-selected' : ''}" type="button" data-size="${escapeHTML(size)}">${escapeHTML(size)}</button>`).join('')}
        </div>
      </div>
      <div class="option-group">
        <strong>Color</strong>
        <div class="option-list">
          ${product.colors.map((color) => `<button class="${store.state.selectedColor === color ? 'is-selected' : ''}" type="button" data-color="${escapeHTML(color)}">${escapeHTML(color)}</button>`).join('')}
        </div>
      </div>
      <ul class="guarantees">
        <li>Garantía de calidad por 12 meses</li>
        <li>Cambios fáciles durante 30 días</li>
        <li>Empaque premium reciclable</li>
      </ul>
      <button class="btn btn-dark" type="button" data-modal-add="${escapeHTML(product.id)}">Agregar al carrito</button>
    </div>
  `;
}

function openDrawer(drawer) {
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
}

function closeDrawer(drawer) {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('is-open') && !wishlistDrawer.classList.contains('is-open') && !modal.open) {
    document.body.classList.remove('is-locked');
  }
}

function closeModal() {
  modal.close();
  document.body.classList.remove('is-locked');
}

function renderIntegrationStatus() {
  const config = window.FormaIntegrations?.getConfig?.() || {};
  const statuses = {
    shopify: config.shopify?.enableRemoteProducts && config.shopify?.domain ? 'Conectado' : 'Modo demo',
    supabase: config.supabase?.url && config.supabase?.anonKey ? 'Conectado' : 'Modo demo',
    chatbase: config.chatbase?.enabled && config.chatbase?.botId ? 'Activo' : 'Modo demo',
  };

  Object.entries(statuses).forEach(([key, label]) => {
    const node = document.querySelector(`[data-integration-status="${key}"]`);
    if (!node) return;
    node.textContent = label;
    node.classList.toggle('is-live', label !== 'Modo demo');
  });
}

function render() {
  renderProducts();
  renderCart();
  renderWishlist();
  renderIntegrationStatus();
}

async function hydrateCatalog() {
  try {
    const remoteProducts = await window.FormaIntegrations?.fetchShopifyProducts?.();
    if (remoteProducts?.length) {
      products = remoteProducts;
      render();
      window.FormaIntegrations?.trackEvent('shopify_catalog_loaded', { count: remoteProducts.length });
    }
  } catch (error) {
    console.warn('[FORMA] Shopify catalog fallback enabled:', error.message);
  }
}

document.addEventListener('click', (event) => {
  const filterButton = event.target.closest('[data-filter]');
  const quickAddButton = event.target.closest('[data-quick-add]');
  const productButton = event.target.closest('[data-open-product]');
  const favoriteButton = event.target.closest('[data-favorite]');
  const quantityButton = event.target.closest('[data-qty]');
  const sizeButton = event.target.closest('[data-size]');
  const colorButton = event.target.closest('[data-color]');
  const modalAddButton = event.target.closest('[data-modal-add]');

  if (filterButton) {
    store.set({ filter: filterButton.dataset.filter });
    document.querySelectorAll('[data-filter]').forEach((button) => button.classList.toggle('is-active', button === filterButton));
  }
  if (quickAddButton) addToCart(quickAddButton.dataset.quickAdd);
  if (productButton) openProduct(productButton.dataset.openProduct);
  if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
  if (quantityButton) changeQuantity(quantityButton.dataset.qty, Number(quantityButton.dataset.amount));
  if (sizeButton) { store.state.selectedSize = sizeButton.dataset.size; renderModal(); }
  if (colorButton) { store.state.selectedColor = colorButton.dataset.color; renderModal(); }
  if (modalAddButton) {
    closeModal();
    addToCart(modalAddButton.dataset.modalAdd, { size: store.state.selectedSize, color: store.state.selectedColor });
  }

  if (event.target.closest('[data-open-cart]')) openDrawer(cartDrawer);
  if (event.target.closest('[data-close-cart]')) closeDrawer(cartDrawer);
  if (event.target.closest('[data-open-wishlist]')) openDrawer(wishlistDrawer);
  if (event.target.closest('[data-close-wishlist]')) closeDrawer(wishlistDrawer);
  if (event.target.closest('[data-close-modal]')) closeModal();
  if (event.target === cartDrawer) closeDrawer(cartDrawer);
  if (event.target === wishlistDrawer) closeDrawer(wishlistDrawer);
  if (event.target.closest('[data-open-featured]')) openProduct('linen-trench');
});

document.querySelector('[data-sort]').addEventListener('change', (event) => store.set({ sort: event.target.value }));
document.querySelector('[data-search]').addEventListener('input', (event) => store.set({ search: event.target.value }));
document.querySelector('[data-view-toggle]').addEventListener('click', (event) => {
  store.state.compact = !store.state.compact;
  event.currentTarget.setAttribute('aria-pressed', String(store.state.compact));
  renderProducts();
});

document.querySelector('[data-newsletter-form]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.currentTarget.querySelector('input[type="email"]').value;
  await window.FormaIntegrations?.saveNewsletter?.(email);
  window.FormaIntegrations?.trackEvent('newsletter_signup', { email });
  document.querySelector('[data-newsletter-message]').textContent = 'Listo. Te avisaremos del próximo drop privado.';
});

modal.addEventListener('click', (event) => {
  const dialogBounds = modal.getBoundingClientRect();
  const isBackdropClick = event.clientX < dialogBounds.left || event.clientX > dialogBounds.right || event.clientY < dialogBounds.top || event.clientY > dialogBounds.bottom;
  if (isBackdropClick) closeModal();
});

render();
window.FormaIntegrations?.loadChatbase?.();
hydrateCatalog();
