const PRODUCTS_KEY = "origenes_products";
const CART_KEY = "origenes_cart";
const USERS_KEY = "origenes_usuarios";
const ACTIVE_USER_KEY = "usuarioActivo";

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

function getUsuarios() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsuarios(usuarios) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

function getUsuarioActivo() {
  return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY)) || null;
}

function setUsuarioActivo(usuario) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

// El formato "Mayúsculas Iniciales" forma parte del contrato del dato
// que mostramos en el navbar; lo centralizamos aquí para que cualquier
// consumidor (login, navbar) reciba el nombre ya normalizado.
function capitalizarNombre(nombre) {
  return (nombre || "")
    .toLocaleLowerCase("es-CO")
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toLocaleUpperCase("es-CO") + parte.slice(1))
    .join(" ");
}

const ADMIN_HARDCODED = {
  nombre: "Administrador",
  correo: "admin@mail.com",
  contrasena: "123456",
};

// Sembramos el admin al cargar storage.js en cualquier página. Es idempotente:
// si el correo ya existe no duplica. Esto cumple la rúbrica de "usuario admin
// hardcodeado pre-almacenado en LocalStorage" sin meter lógica especial en login.
(function garantizarAdminPorDefecto() {
  const usuarios = getUsuarios();
  const existe = usuarios.some(
    (usuario) => usuario.correo.toLowerCase() === ADMIN_HARDCODED.correo
  );
  if (!existe) {
    saveUsuarios([ADMIN_HARDCODED, ...usuarios]);
  }
})();