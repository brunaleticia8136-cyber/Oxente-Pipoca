import { state } from './state.js';
import { renderProducts, updateProductCard } from './catalog.js';
import { persistCart, addToCart, renderCart, updateCartQuantity, openCart, closeCart } from './cart.js';
import { openWhatsapp, checkout, consultProduct } from './whatsapp.js';
import { showToast, observeReveals } from './ui.js';
import { setupWebMCP } from './webmcp.js';

document.addEventListener('click', event => {
  const sizeButton = event.target.closest('[data-size-product]');
  if (sizeButton) {
    state.selections[sizeButton.dataset.sizeProduct].size = sizeButton.dataset.size;
    updateProductCard(sizeButton.dataset.sizeProduct);
  }
  const cardQty = event.target.closest('[data-card-qty]');
  if (cardQty) {
    const selection = state.selections[cardQty.dataset.product];
    selection.qty = Math.max(1, Math.min(20, selection.qty + (cardQty.dataset.cardQty === 'up' ? 1 : -1)));
    updateProductCard(cardQty.dataset.product);
  }
  const addButton = event.target.closest('[data-add-product]');
  if (addButton) addToCart(addButton.dataset.addProduct);
  const consultButton = event.target.closest('[data-consult]');
  if (consultButton) consultProduct(consultButton.dataset.consult);
  if (event.target.closest('[data-open-cart]')) openCart();
  if (event.target.closest('[data-close-cart]') || event.target.closest('[data-cart-backdrop]')) closeCart();
  const cartQty = event.target.closest('[data-cart-qty]');
  if (cartQty) updateCartQuantity(cartQty.dataset.key, cartQty.dataset.cartQty);
  const remove = event.target.closest('[data-remove]');
  if (remove) { state.cart = state.cart.filter(item => item.key !== remove.dataset.remove); persistCart(); showToast('Produto removido'); }
  if (event.target.closest('[data-checkout]')) checkout();
  if (event.target.closest('[data-empty-menu]')) { closeCart(); document.querySelector('#cardapio').scrollIntoView({ behavior: 'smooth' }); }
  if (event.target.closest('[data-event-whatsapp]')) openWhatsapp('Olá! Gostaria de saber mais sobre as encomendas para eventos da Oxente Pipoca Gourmet. 😊');
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    document.querySelectorAll('#traditional-products .product-card').forEach(card => { card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter; });
  }
});

document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
renderProducts();
renderCart();
observeReveals();
setupWebMCP();
