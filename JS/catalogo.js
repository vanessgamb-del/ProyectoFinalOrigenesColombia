const catalogContainer = document.getElementById("catalogContainer");

function renderCatalog() {
  if (!catalogContainer) {
    return;
  }

  const products = getProducts();

  if (products.length === 0) {
    catalogContainer.innerHTML = `
      <div class="col-12">
        <div class="empty-state p-4 text-center">
          No hay productos disponibles en el catálogo todavía.
        </div>
      </div>
    `;
    return;
  }

  catalogContainer.innerHTML = products
    .map((product) => {
      return `
        <div class="col-md-6 col-lg-4">
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" />
            <div class="card-body">
              <span class="badge-category">${product.category}</span>
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="price-text">$${Number(product.price).toLocaleString("es-CO")}</p>
              <p class="stock-text">Disponibles: ${product.stock}</p>
              <button class="btn-buy" onclick="addToCart(${product.id})">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

window.addEventListener("storage", (event) => {
  if (event.key === "origenes_products") {
    renderCatalog();
  }
});

renderCatalog();