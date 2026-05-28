const PRODUCTS_KEY = "origenes_products";
const CART_KEY = "origenes_cart";
const USERS_KEY = "origenes_usuarios";
const ACTIVE_USER_KEY = "usuarioActivo";

/** Correo del administrador hardcodeado para acceso al panel. */
const ADMIN_EMAIL = "admin@mail.com";

/**
 * Obtiene la lista de productos desde localStorage.
 * @returns {Array<Object>} Productos del catálogo.
 */
function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

/**
 * Guarda la lista de productos en localStorage.
 * @param {Array<Object>} products - Productos a persistir.
 */
function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

/**
 * Obtiene los ítems del carrito desde localStorage.
 * @returns {Array<{productId: number, quantity: number}>}
 */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Guarda el carrito en localStorage.
 * @param {Array<{productId: number, quantity: number}>} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Obtiene todos los usuarios registrados.
 * @returns {Array<{nombre: string, correo: string, contrasena: string, telefono?: string}>}
 */
function getUsuarios() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

/**
 * Guarda la lista de usuarios en localStorage.
 * @param {Array<Object>} usuarios
 */
function saveUsuarios(usuarios) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

/**
 * Obtiene el usuario con sesión activa.
 * @returns {Object|null}
 */
function getUsuarioActivo() {
  return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY)) || null;
}

/**
 * Marca un usuario como sesión activa.
 * @param {Object} usuario
 */
function setUsuarioActivo(usuario) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(usuario));
}

/** Cierra la sesión eliminando el usuario activo de localStorage. */
function cerrarSesion() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

/**
 * Normaliza un nombre a formato "Mayúsculas Iniciales".
 * @param {string} nombre
 * @returns {string}
 */
function capitalizarNombre(nombre) {
  return (nombre || "")
    .toLocaleLowerCase("es-CO")
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toLocaleUpperCase("es-CO") + parte.slice(1))
    .join(" ");
}

/**
 * Indica si el usuario tiene permisos de administrador.
 * @param {Object|null} usuario
 * @returns {boolean}
 */
function esUsuarioAdmin(usuario) {
  return (
    usuario &&
    usuario.correo &&
    usuario.correo.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
}

const ADMIN_HARDCODED = {
  nombre: "Administrador",
  correo: ADMIN_EMAIL,
  contrasena: "123456",
  telefono: "3000000000",
};

(function garantizarAdminPorDefecto() {
  const usuarios = getUsuarios();
  const existe = usuarios.some(
    (usuario) => usuario.correo.toLowerCase() === ADMIN_HARDCODED.correo
  );
  if (!existe) {
    saveUsuarios([ADMIN_HARDCODED, ...usuarios]);
  }
})();
