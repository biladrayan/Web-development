const cartKey = 'lumina-cart';
let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
function persist() { localStorage.setItem(cartKey, JSON.stringify(cart)); }
export function getCart() { return cart; }
export function addToCart(id) { const item = cart.find(entry => entry.id === id); if (item) item.quantity += 1; else cart.push({ id, quantity: 1 }); persist(); }
export function updateQuantity(id, quantity) { cart = cart.map(item => item.id === id ? { ...item, quantity } : item).filter(item => item.quantity > 0); persist(); }
export function removeFromCart(id) { cart = cart.filter(item => item.id !== id); persist(); }
export function cartItemCount() { return cart.reduce((total, item) => total + item.quantity, 0); }
export function cartTotal(products) { return cart.reduce((total, item) => total + products.find(product => product.id === item.id).price * item.quantity, 0); }
