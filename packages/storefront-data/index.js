export const products = [
  { id: 'linen-trench', name: 'Trench Lino Arena', category: 'Prendas', price: 148 },
  { id: 'arc-bag', name: 'Bolso Arc Cognac', category: 'Bolsos', price: 96 },
  { id: 'silk-scarf', name: 'Pañuelo Seda Grid', category: 'Accesorios', price: 44 },
  { id: 'weekend-tote', name: 'Tote Weekend', category: 'Bolsos', price: 112 },
  { id: 'scent-candle', name: 'Vela Santal 300g', category: 'Hogar', price: 38 },
];

export const categories = [...new Set(products.map((product) => product.category))];
