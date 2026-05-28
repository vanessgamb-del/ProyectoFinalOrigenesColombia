const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");
const buyBtn = document.getElementById("buyBtn");

/** Abre el panel lateral del carrito. */
function openCart() {
  if (cartDrawer) {
    cartDrawer.classList.add("open");
  }

  if (cartOverlay) {
    cartOverlay.classList.add("show");
  }
}

/** Cierra el panel lateral del carrito. */
function closeCartDrawer() {
  if (cartDrawer) {
    cartDrawer.classList.remove("open");
  }

  if (cartOverlay) {
    cartOverlay.classList.remove("show");
  }
}

/** Actualiza el contador de ítems en el icono del carrito. */
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

/**
 * Agrega un producto al carrito respetando el stock disponible.
 * @param {number} productId
 */
function addToCart(productId) {
  const products = getProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (product.stock <= 0) {
    alert("Este producto no tiene stock disponible.");
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      alert("No puedes agregar más unidades que el stock disponible.");
      return;
    }

    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      quantity: 1,
    });
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
  const item = cart.find((cartItem) => cartItem.productId === productId);

  if (!item) {
    return;
  }

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.productId !== productId);
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
  const products = getProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.productId === productId);

  if (!item) {
    return;
  }

  if (item.quantity >= product.stock) {
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
  const cart = getCart().filter((item) => item.productId !== productId);
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
  if (!cartItems || !totalElement) {
    return;
  }

  const cart = getCart();
  const products = getProducts();

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-state p-3 text-center">Tu carrito está vacío.</p>
    `;
    totalElement.textContent = "$0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.productId);

      if (!product) {
        return "";
      }

      const subtotal = Number(product.price) * Number(item.quantity);
      total += subtotal;
      const descripcion = product.description || "Sin descripción";

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
          <div class="cart-item-info">
            <div class="cart-item-title">${product.name}</div>
            <div class="cart-item-desc">${descripcion}</div>
            <div class="cart-item-meta">Cantidad: ${item.quantity}</div>
            <div class="cart-item-meta">Precio: $${Number(product.price).toLocaleString("es-CO")}</div>
            <div class="cart-item-subtotal">Subtotal: $${subtotal.toLocaleString("es-CO")}</div>
            <div class="cart-item-actions">
              <button class="btn-qty" onclick="decreaseQuantity(${product.id})">-</button>
              <button class="btn-qty" onclick="increaseQuantity(${product.id})">+</button>
              <button class="btn-remove" onclick="removeFromCart(${product.id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  totalElement.textContent = `$${total.toLocaleString("es-CO")}`;
}

if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}

if (closeCart) {
  closeCart.addEventListener("click", closeCartDrawer);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCartDrawer);
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

if (buyBtn) {
  buyBtn.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    alert("Compra realizada con éxito.");
    clearCart();
    closeCartDrawer();
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "origenes_cart") {
    renderCart();
    updateCartCount();
  }
});

renderCart();
updateCartCount();
