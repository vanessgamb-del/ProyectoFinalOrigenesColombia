const BASE_URL = "https://origenesdeployback.onrender.com";



const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");
const buyBtn = document.getElementById("buyBtn");

/*  funciones de localStorage */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
 
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Abre el panel lateral del carrito. */
// function openCart() {
//   if (cartDrawer) {
//     cartDrawer.classList.add("open");
//   }

//   if (cartOverlay) {
//     cartOverlay.classList.add("show");
//   }
// }

// /** Cierra el panel lateral del carrito. */
function openCart() {
  cartDrawer?.classList.add("open");
  cartOverlay?.classList.add("show");
}
 
function closeCartDrawer() {
  cartDrawer?.classList.remove("open");
  cartOverlay?.classList.remove("show");
}
 
function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = total;
}
// function closeCartDrawer() {
//   if (cartDrawer) {
//     cartDrawer.classList.remove("open");
//   }

//   if (cartOverlay) {
//     cartOverlay.classList.remove("show");
//   }
// }

// /** Actualiza el contador de ítems en el icono del carrito. */
// function updateCartCount() {
//   const cart = getCart();
//   const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

//   if (cartCount) {
//     cartCount.textContent = totalItems;
//   }
// }

/**
 * Agrega un producto al carrito respetando el stock disponible.
 * @param {number} productId
 */
function addToCart(id, nombre, precio, stock, imagen, descripcion) {
  if (stock <= 0) {
    alert("Este producto no tiene stock disponible.");
    return;
  }
 
  const cart     = getCart();
  const existing = cart.find(item => item.id === id);
 
  if (existing) {
    if (existing.quantity >= stock) {
      alert("No puedes agregar más unidades que el stock disponible.");
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({ id, nombre, precio, stock, imagen, descripcion, quantity: 1 });
  }
 
  saveCart(cart);
  renderCart();
  updateCartCount();
  openCart();
}


/**
 * Disminuye en una unidad la cantidad de un producto en el carrito.
 * @param {number} productId
 */

function decreaseQuantity(productId) {
  let cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) {
    return;
  }

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

/**
 * Aumenta en una unidad la cantidad de un producto en el carrito.
 * @param {number} productId
 */

function increaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  if (item.quantity >= item.stock) {
    alert("No puedes agregar más unidades que el stock disponible.");
    return;
  }

  item.quantity += 1;
  saveCart(cart);
  renderCart();
  updateCartCount();
}

/**
 * Elimina por completo un producto del carrito.
 * @param {number} productId
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

/** Vacía todos los ítems del carrito. */
function clearCart() {
  saveCart([]);
  renderCart();
  updateCartCount();
}

/** Renderiza los ítems del carrito y recalcula el total. */
function renderCart() {
  if (!cartItems || !totalElement) return;
 
  const cart = getCart();
 
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-state p-3 text-center">Tu carrito está vacío.</p>`;
    totalElement.textContent = "$0";
    return;
  }
 
  let total = 0;
 
  cartItems.innerHTML = cart.map(item => {
    const subtotal = item.precio * item.quantity;
    total += subtotal;
    return `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.nombre}</div>
          <div class="cart-item-desc">${item.descripcion || ""}</div>
          <div class="cart-item-meta">Precio: $${item.precio.toLocaleString("es-CO")}</div>
          <div class="cart-item-subtotal">Subtotal: $${subtotal.toLocaleString("es-CO")}</div>
          <div class="cart-item-actions">
            <button class="btn-qty"    onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button class="btn-qty"    onclick="increaseQuantity(${item.id})">+</button>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
          </div>
        </div>
      </div>`;
  }).join("");
 
  totalElement.textContent = `$${total.toLocaleString("es-CO")}`;
}

async function completarCompra() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
 
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuarioActivo || !usuarioActivo.id) {
    alert("Debes iniciar sesión para completar la compra.");
    window.location.href = "../HTML/login.html";
    return;
  }
 
  const direccion = prompt("Ingresa tu dirección de envío:");
  if (!direccion || direccion.trim() === "") {
    alert("La dirección de envío es obligatoria.");
    return;
  }
 
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
 
  try {
    // 1. Crear el pedido
    const pedidoRes = await fetch(`${BASE_URL}/pedidos`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado:          "PENDIENTE",
        clienteId:       usuarioActivo.id,
        total:           total,
        direccion_envio: direccion.trim(),
      }),
    });
 
    if (!pedidoRes.ok) throw new Error(`Error al crear pedido: ${pedidoRes.status}`);
    const pedido = await pedidoRes.json();
 
    // 2. Registrar cada ítem — solo necesitamos id y quantity (precio ya está en localStorage)
    const detalles = await Promise.all(
      cart.map(item =>
        fetch(`${BASE_URL}/detalle-pedidos`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pedidoId:       pedido.id,
            productoId:     item.id,
            cantidad:       item.quantity,
            precioUnitario: item.precio,
          }),
        })
      )
    );
 
    if (detalles.some(r => !r.ok)) throw new Error("Error registrando algunos productos.");
 
    alert(`✅ ¡Compra realizada! Tu número de pedido es #${pedido.id}.`);
    clearCart();
    closeCartDrawer();
 
  } catch (error) {
    console.error("Error al completar la compra:", error);
    alert("Hubo un error al procesar la compra, intenta de nuevo.");
  }
}
 
// ─── Event listeners ─────────────────────────────────────────────────────────
 
cartBtn?.addEventListener("click", openCart);
closeCart?.addEventListener("click", closeCartDrawer);
cartOverlay?.addEventListener("click", closeCartDrawer);
clearCartBtn?.addEventListener("click", clearCart);
buyBtn?.addEventListener("click", completarCompra);
 
window.addEventListener("storage", (event) => {
  if (event.key === CART_KEY) {
    renderCart();
    updateCartCount();
  }
});
 
renderCart();
updateCartCount();