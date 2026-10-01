import { PRODUCTS, productById } from '../data/products.js';
import { state, money } from './state.js';
import { persistCart, cartSummary, openCart } from './cart.js';

export function setupWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const fail = error => console.warn('WebMCP:', error);
  const register = tool => {
    try { void Promise.resolve(context.registerTool(tool)).catch(fail); }
    catch (error) { fail(error); }
  };
  register({
    name: 'read_popcorn_menu',
    title: 'Consultar cardápio',
    description: 'Lista os sabores disponíveis, tamanhos e preços atuais da Oxente Pipoca Gourmet.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return { products: PRODUCTS.map(product => ({ id: product.id, name: product.name, category: product.category, available: product.available, sizes: Object.fromEntries(Object.entries(product.sizes).map(([size, price]) => [size, money(price)])) })) };
    }
  });
  register({
    name: 'add_items_to_order',
    title: 'Adicionar itens ao pedido',
    description: 'Adiciona um ou mais sabores e tamanhos ao mesmo carrinho exibido na página.',
    inputSchema: {
      type: 'object',
      properties: { items: { type: 'array', minItems: 1, items: { type: 'object', properties: { productId: { type: 'string' }, size: { type: 'string', enum: ['250g', '500g'] }, quantity: { type: 'integer', minimum: 1, maximum: 20 } }, required: ['productId', 'size', 'quantity'], additionalProperties: false } } },
      required: ['items'], additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !Array.isArray(input.items) || input.items.length === 0) throw new Error('Informe ao menos um item.');
      input.items.forEach(requested => {
        const product = productById(requested.productId);
        if (!product?.available || !product.sizes[requested.size]) throw new Error(`Produto ou tamanho indisponível: ${requested.productId}.`);
        if (!Number.isInteger(requested.quantity) || requested.quantity < 1 || requested.quantity > 20) throw new Error('A quantidade deve estar entre 1 e 20.');
        const key = `${product.id}-${requested.size}`;
        const existing = state.cart.find(item => item.key === key);
        if (existing) existing.qty += requested.quantity;
        else state.cart.push({ key, productId: product.id, size: requested.size, qty: requested.quantity });
      });
      persistCart();
      const summary = cartSummary();
      return { itemCount: summary.items, total: money(summary.total) };
    }
  });
  register({
    name: 'review_order',
    title: 'Revisar pedido',
    description: 'Abre o painel de pedido e retorna o resumo atual do carrinho.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute() {
      openCart();
      const summary = cartSummary();
      return { itemCount: summary.items, total: money(summary.total) };
    }
  });
}
