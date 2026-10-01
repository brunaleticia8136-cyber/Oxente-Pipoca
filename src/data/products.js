export const PRODUCTS = [
  {
    id: 'chocolate-meio-amargo',
    name: 'Chocolate meio amargo',
    category: 'doce',
    group: 'traditional',
    image: './images/chocolate-meio-amargo.webp',
    badge: 'Clássico',
    description: 'Chocolate meio amargo, com sabor intenso e equilibrado para quem gosta de chocolate.',
    sizes: { '250g': 1000, '500g': 1800 },
    available: true
  },
  {
    id: 'nesquik',
    name: 'Nesquik',
    category: 'doce',
    group: 'traditional',
    image: './images/nesquik.webp',
    badge: 'Crocante',
    description: 'Crocante, com o sabor suave e marcante de Nesquik.',
    sizes: { '250g': 1000, '500g': 1800 },
    available: true
  },
  {
    id: 'ninho',
    name: 'Ninho',
    category: 'doce',
    group: 'traditional',
    image: './images/ninho.webp',
    badge: 'Crocante',
    description: 'Crocante e com o sabor suave e marcante de Ninho.',
    sizes: { '250g': 1000, '500g': 1800 },
    available: true
  },
  {
    id: 'ovomaltine',
    name: 'Ovomaltine',
    category: 'doce',
    group: 'traditional',
    image: './images/ovomaltine.webp',
    badge: 'Crocante',
    description: 'Crocante, com o sabor marcante de Ovomaltine.',
    sizes: { '250g': 1200, '500g': 2000 },
    available: true
  },
  {
    id: 'morango-cravejado',
    name: 'Morango cravejado',
    category: 'doce',
    group: 'traditional',
    image: './images/morango-cravejado.webp',
    badge: 'Frutado',
    description: 'Com pedaços de caramelo que trazem uma textura crocante e deliciosa a cada mordida.',
    sizes: { '250g': 1200, '500g': 2000 },
    available: true
  },
  {
    id: 'maracuja',
    name: 'Pipoca de Maracujá',
    category: 'doce',
    group: 'traditional',
    image: './images/maracuja.webp',
    badge: 'Frutado',
    description: 'O sabor azedinho e refrescante do maracujá, com as sementinhas da fruta trazendo uma textura crocante a cada mordida.',
    sizes: { '250g': 1200, '500g': 2000 },
    available: true
  },
  {
    id: 'agridoce-ruffles',
    name: 'Agridoce Ruffles',
    category: 'agridoce',
    group: 'traditional',
    image: './images/agridoce-ruffles.webp',
    badge: 'Agridoce',
    description: 'Crocante, saborosa e preparada com muito cuidado.',
    sizes: { '250g': 1000, '500g': 1800 },
    available: true
  },
  {
    id: 'agridoce-doritos',
    name: 'Agridoce Doritos',
    category: 'agridoce',
    group: 'traditional',
    image: './images/agridoce-doritos.webp',
    badge: 'Agridoce',
    description: 'Crocante, saborosa e preparada com muito cuidado.',
    sizes: { '250g': 1000, '500g': 1800 },
    available: true
  },
  {
    id: 'recheada-nutella',
    name: 'Recheada Nutella',
    category: 'recheada',
    group: 'filled',
    image: './images/recheada-nutella.webp',
    badge: 'Recheada',
    description: 'Pipoca crocante com cobertura doce, acompanhada de recheio de Nutella.',
    sizes: { '250g': 1200, '500g': 2000 },
    available: true
  },
  {
    id: 'recheada-ninho',
    name: 'Recheada Leite Ninho',
    category: 'recheada',
    group: 'filled',
    image: './images/recheada-ninho.webp',
    badge: 'Recheada',
    description: 'Pipoca crocante com cobertura doce, acompanhada de recheio de Ninho.',
    sizes: { '250g': 1200, '500g': 2000 },
    available: true
  }
];

export const productById = id => PRODUCTS.find(product => product.id === id);
