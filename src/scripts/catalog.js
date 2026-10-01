import { PRODUCTS, productById } from '../data/products.js';
import { state, money } from './state.js';
import { observeReveals } from './ui.js';

export function productCard(product) {
  const selection = state.selections[product.id];
  if (!product.available) {
    return `<article class="product-card consult-card reveal" data-category="${product.category}">
      <div class="product-image-wrap"><img class="product-image" src="${product.image}" alt="Pipoca ${product.name}" loading="lazy"><span class="product-badge">${product.badge}</span></div>
      <div class="product-body"><h3>${product.name}</h3><p class="product-description">${product.description}</p><div class="consult-price">Preço sob consulta</div><div class="product-actions"><button class="add-btn" type="button" data-consult="${product.id}">Consultar no WhatsApp</button></div></div>
    </article>`;
  }
  const options = Object.entries(product.sizes).map(([size, price], index) => `<button class="size-option ${index === 0 ? 'selected' : ''}" type="button" data-size-product="${product.id}" data-size="${size}" aria-pressed="${index === 0}"><strong>${size}</strong><small>${money(price)}</small></button>`).join('');
  return `<article class="product-card reveal" data-category="${product.category}">
    <div class="product-image-wrap"><img class="product-image" src="${product.image}" alt="Pipoca ${product.name}" loading="lazy"><span class="product-badge">${product.badge}</span></div>
    <div class="product-body"><h3>${product.name}</h3><p class="product-description">${product.description}</p><span class="size-label">Escolha o tamanho</span><div class="size-options">${options}</div>
      <div class="product-actions"><div class="qty-control" aria-label="Quantidade de ${product.name}"><button type="button" data-card-qty="down" data-product="${product.id}" aria-label="Diminuir quantidade">−</button><span data-card-qty-value="${product.id}">${selection.qty}</span><button type="button" data-card-qty="up" data-product="${product.id}" aria-label="Aumentar quantidade">+</button></div><button class="add-btn" type="button" data-add-product="${product.id}">Adicionar • ${money(product.sizes[selection.size] * selection.qty)}</button></div>
    </div>
  </article>`;
}

export function renderProducts() {
  document.querySelector('#traditional-products').innerHTML = PRODUCTS.filter(product => product.group === 'traditional').map(productCard).join('');
  document.querySelector('#filled-products').innerHTML = PRODUCTS.filter(product => product.group === 'filled').map(productCard).join('');
  observeReveals();
}

export function updateProductCard(productId) {
  const product = productById(productId);
  const selection = state.selections[productId];
  document.querySelectorAll(`[data-size-product="${productId}"]`).forEach(button => {
    const selected = button.dataset.size === selection.size;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const qty = document.querySelector(`[data-card-qty-value="${productId}"]`);
  if (qty) qty.textContent = selection.qty;
  const add = document.querySelector(`[data-add-product="${productId}"]`);
  if (add) add.textContent = `Adicionar • ${money(product.sizes[selection.size] * selection.qty)}`;
}
