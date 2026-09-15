import { getRoute } from './router.js';
import { products } from './data.js';
import { addToCart, getCart, removeFromCart, updateQuantity } from './store.js';
import { aboutPage, cartPage, homePage, notFoundPage, productPage, shopPage, updateCartCount } from './ui.js';

const app = document.querySelector('#app');
function render() {
  const { path, params } = getRoute();
  if (path === '/') app.innerHTML = homePage();
  else if (path === '/shop') app.innerHTML = shopPage(params.get('category') || 'All');
  else if (path.startsWith('/product/')) app.innerHTML = productPage(path.split('/')[2]);
  else if (path === '/cart') app.innerHTML = cartPage();
  else if (path === '/about') app.innerHTML = aboutPage();
  else app.innerHTML = notFoundPage();
  updateCartCount(); app.focus();
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const { action, id, delta } = button.dataset;
  if (action === 'add') { addToCart(id); updateCartCount(); button.textContent = 'Added!'; setTimeout(() => { button.textContent = button.classList.contains('quick-add') ? '+' : 'Add to bag'; }, 900); }
  if (action === 'remove') { removeFromCart(id); render(); }
  if (action === 'quantity') { const item = getCart().find(item => item.id === id); updateQuantity(id, item.quantity + Number(delta)); render(); }
  if (action === 'checkout') alert('This is a catalog demo. Connect a payment provider to enable checkout.');
});
window.addEventListener('hashchange', render);
if (!location.hash) location.hash = '#/'; else render();
