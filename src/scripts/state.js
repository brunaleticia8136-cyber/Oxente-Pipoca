import { STORE_CONFIG } from '../config/store.js';
import { PRODUCTS } from '../data/products.js';

export const state = {
  cart: JSON.parse(localStorage.getItem('oxente-cart') || '[]'),
  selections: Object.fromEntries(PRODUCTS.map(product => [product.id, { size: Object.keys(product.sizes)[0] || '', qty: 1 }]))
};

export const money = cents => new Intl.NumberFormat(STORE_CONFIG.locale, { style: 'currency', currency: STORE_CONFIG.currency }).format(cents / 100);
