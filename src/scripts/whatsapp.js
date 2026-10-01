import { STORE_CONFIG } from '../config/store.js';
import { productById } from '../data/products.js';
import { state, money } from './state.js';
import { cartSummary } from './cart.js';

export function whatsappUrl(message) {
  const number = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function openWhatsapp(message) {
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
}

export function checkout() {
  if (!state.cart.length) return;
  const lines = state.cart.map(item => {
    const product = productById(item.productId);
    const subtotal = product.sizes[item.size] * item.qty;
    return `• ${item.qty}x ${product.name} — ${item.size} — ${money(subtotal)}`;
  });
  const total = cartSummary().total;
  const message = `Olá! Gostaria de fazer um pedido:\n\n${lines.join('\n')}\n\nTotal do pedido: ${money(total)}\n\nGostaria de finalizar meu pedido. 😊`;
  openWhatsapp(message);
}

export function consultProduct(productId) {
  const product = productById(productId);
  openWhatsapp(`Olá! Gostaria de saber o preço e os tamanhos disponíveis da pipoca ${product.name}.`);
}
