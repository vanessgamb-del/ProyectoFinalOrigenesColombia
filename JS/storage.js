const PRODUCTS_KEY = "origenes_products";
const CART_KEY = "origenes_cart";
const USUARIOS_KEY = "origenes_usarios";

function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getUsarios() {
  return JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
}

function saveUsuario(usuario) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuario));
}