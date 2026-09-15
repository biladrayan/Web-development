export const products = [
  { id: 'aurora-lamp', name: 'Aurora Lamp', category: 'Lighting', price: 128, image: 'assets/aurora.svg', description: 'A warm amber-glass lamp made to soften the edges of a long evening.' },
  { id: 'cinder-vase', name: 'Cinder Vase', category: 'Objects', price: 74, image: 'assets/cinder.svg', description: 'A hand-finished ceramic vessel with a calm, sculptural profile.' },
  { id: 'solace-throw', name: 'Solace Throw', category: 'Textiles', price: 96, image: 'assets/solace.svg', description: 'A generously sized woven throw in a grounded, sun-warmed palette.' },
  { id: 'arc-clock', name: 'Arc Clock', category: 'Objects', price: 88, image: 'assets/arc.svg', description: 'A quiet wall clock with a precise sweep and a graphic circular form.' },
  { id: 'sora-table', name: 'Sora Table', category: 'Furniture', price: 212, image: 'assets/sora.svg', description: 'A compact side table designed to hold a book, a cup, and a little pause.' }
];
export const categories = ['All', ...new Set(products.map(product => product.category))];
