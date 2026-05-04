document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const closeCart = document.getElementById("closeCart");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const total = document.getElementById("total");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const buyBtn = document.getElementById("buyBtn");

  if (
    !cartBtn ||
    !closeCart ||
    !cartDrawer ||
    !cartOverlay ||
    !cartItems ||
    !cartCount ||
    !total ||
    !clearCartBtn ||
    !buyBtn
  ) {
    return;
  }

  function openCart() {
    cartDrawer.classList.add("cart-drawer-open");
    cartOverlay.classList.add("cart-overlay-show");
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove("cart-drawer-open");
    cartOverlay.classList.remove("cart-overlay-show");
  }

  function formatPrice(value) {
    return `$${Number(value).toLocaleString("es-CO")}`;
  }

  function updateCartCount(cart) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
  }

  function renderCart() {
    const cart = getCart();

    updateCartCount(cart);

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          Tu carrito está vacío.
        </div>
      `;
      total.textContent = "$0";
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" />

            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>${formatPrice(item.price)}</p>

              <div class="cart-item-actions">
                <button onclick="decreaseCartItem(${item.productId})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseCartItem(${item.productId})">+</button>
              </div>
            </div>

            <button class="remove-cart-item" onclick="removeCartItem(${item.productId})">
              &times;
            </button>
          </div>
        `
      )
      .join("");

    const totalValue = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    total.textContent = formatPrice(totalValue);
  }

  window.addToCart = function (productId) {
    const products = getProducts();
    const product = products.find((item) => item.id === productId);

    if (!product) {
      alert("Producto no encontrado.");
      return;
    }

    if (product.stock <= 0) {
      alert("Producto sin stock disponible.");
      return;
    }

    const cart = getCart();
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("No hay más unidades disponibles.");
        return;
      }

      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    saveCart(cart);
    renderCart();
    openCart();
  };

  window.increaseCartItem = function (productId) {
    const products = getProducts();
    const product = products.find((item) => item.id === productId);
    const cart = getCart();
    const cartItem = cart.find((item) => item.productId === productId);

    if (!product || !cartItem) return;

    if (cartItem.quantity >= product.stock) {
      alert("No hay más unidades disponibles.");
      return;
    }

    cartItem.quantity += 1;
    saveCart(cart);
    renderCart();
  };

  window.decreaseCartItem = function (productId) {
    let cart = getCart();
    const cartItem = cart.find((item) => item.productId === productId);

    if (!cartItem) return;

    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
      cart = cart.filter((item) => item.productId !== productId);
    }

    saveCart(cart);
    renderCart();
  };

  window.removeCartItem = function (productId) {
    const cart = getCart().filter((item) => item.productId !== productId);
    saveCart(cart);
    renderCart();
  };

  clearCartBtn.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });

  buyBtn.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    alert("Compra realizada correctamente.");
    saveCart([]);
    renderCart();
    closeCartDrawer();
  });

  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);

  renderCart();
});