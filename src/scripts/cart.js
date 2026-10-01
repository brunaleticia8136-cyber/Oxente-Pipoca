import { productById } from '../data/products.js';
import { state, money } from './state.js';
import { showToast } from './ui.js';

export function persistCart() {
  localStorage.setItem('oxente-cart', JSON.stringify(state.cart));
  renderCart();
}

export function addToCart(productId) {
  const product = productById(productId);
  const selection = state.selections[productId];
  const key = `${productId}-${selection.size}`;
  const existing = state.cart.find(item => item.key === key);
  if (existing) existing.qty += selection.qty;
  else state.cart.push({ key, productId, size: selection.size, qty: selection.qty });
  persistCart();
  showToast(`${product.name} adicionada ao pedido`);
  document.querySelector('.floating-cart')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 280 });
}

export function cartSummary() {
  return state.cart.reduce((summary, item) => {
    const product = productById(item.productId);
    const unit = product.sizes[item.size];
    summary.items += item.qty;
    summary.total += unit * item.qty;
    return summary;
  }, { items: 0, total: 0 });
}

export function renderCart() {
  const body = document.querySelector('[data-cart-body]');
  const footer = document.querySelector('[data-cart-footer]');
  const summary = cartSummary();
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = summary.items);
  document.querySelectorAll('[data-cart-total]').forEach(el => el.textContent = money(summary.total));
  document.querySelector('.floating-cart').classList.toggle('visible', summary.items > 0);
  if (!state.cart.length) {
    footer.hidden = true;
    body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon"><svg><use href="#i-cart"></use></svg></div><h3>Seu carrinho está vazio.</h3><p>Escolha suas pipocas favoritas para começar seu pedido.</p><button class="btn btn-primary" type="button" data-empty-menu>Ver cardápio</button></div>`;
    return;
  }
  footer.hidden = false;
  body.innerHTML = state.cart.map(item => {
    const product = productById(item.productId);
    const unit = product.sizes[item.size];
    return `<article class="cart-item"><img src="${product.image}" alt="" loading="lazy"><div><div class="cart-item-top"><h3>${product.name}</h3><button class="remove-item" type="button" data-remove="${item.key}" aria-label="Remover ${product.name}">Remover</button></div><div class="cart-item-meta">${item.size} • ${money(unit)} cada</div><div class="cart-item-bottom"><div class="qty-control"><button type="button" data-cart-qty="down" data-key="${item.key}" aria-label="Diminuir quantidade">−</button><span>${item.qty}</span><button type="button" data-cart-qty="up" data-key="${item.key}" aria-label="Aumentar quantidade">+</button></div><span class="cart-item-price">${money(unit * item.qty)}</span></div></div></article>`;
  }).join('');
}

export function updateCartQuantity(key, direction) {
  const item = state.cart.find(entry => entry.key === key);
  if (!item) return;
  item.qty += direction === 'up' ? 1 : -1;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry.key !== key);
  persistCart();
}

export function openCart() {
  document.body.classList.add('cart-open');
  document.querySelector('[data-cart-panel]').classList.add('open');
  document.querySelector('[data-cart-panel]').setAttribute('aria-hidden', 'false');
  document.querySelector('[data-cart-backdrop]').classList.add('visible');
  setTimeout(() => document.querySelector('[data-close-cart]')?.focus(), 100);
}

export function closeCart() {
  document.body.classList.remove('cart-open');
  document.querySelector('[data-cart-panel]').classList.remove('open');
  document.querySelector('[data-cart-panel]').setAttribute('aria-hidden', 'true');
  document.querySelector('[data-cart-backdrop]').classList.remove('visible');
}
