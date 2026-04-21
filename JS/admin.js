const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const STORAGE_KEY = "origenes_productos";

let products = loadProducts();

console.log("admin.js nuevo cargado");
console.log("Productos cargados:", products);

if (productForm && productList) {
  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const priceValue = document.getElementById("price").value.trim();
    const stockValue = document.getElementById("stock").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value.trim();

    const price = parseInt(priceValue, 10);
    const stock = parseInt(stockValue, 10);

    if (!name || !description || !category || !image) {
      alert("Completa todos los campos.");
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      alert("Ingresa un precio válido.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      alert("Ingresa una cantidad válida para el stock.");
      return;
    }

    const product = {
      id: Date.now(),
      name,
      description,
      price,
      stock,
      category,
      image
    };

    products.push(product);
    saveProducts();
    renderProducts();
    productForm.reset();

    console.log("Producto guardado:", product);
    console.log("Productos en localStorage:", localStorage.getItem(STORAGE_KEY));
  });

  renderProducts();
}

function loadProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY);

  if (!savedProducts) {
    return [];
  }

  try {
    return JSON.parse(savedProducts);
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPrice(price) {
  return "$ " + price.toLocaleString("es-CO");
}

function getStockMessage(stock) {
  if (stock === 0) {
    return "Agotado";
  }

  if (stock <= 5) {
    return "Últimas unidades: " + stock;
  }

  return "Disponibles: " + stock;
}

function renderProducts() {
  if (!productList) {
    return;
  }

  if (products.length === 0) {
    productList.innerHTML = `
      <div class="col-12">
        <div class="empty-state text-center p-4">
          No hay productos agregados todavía.
        </div>
      </div>
    `;
    return;
  }

  productList.innerHTML = products
    .map(function (product) {
      return `
        <div class="col-12 col-md-6">
          <div class="card product-card h-100">
            <img
              src="${product.image}"
              class="product-image"
              alt="${product.name}"
              onerror="this.src='https://via.placeholder.com/600x400?text=Imagen+no+disponible'"
            />
            <div class="card-body text-start">
              <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
                <h5 class="card-title mb-0">${product.name}</h5>
                <span class="badge-category">${product.category}</span>
              </div>

              <p class="card-text text-muted">${product.description}</p>
              <p class="price-text mb-2">${formatPrice(product.price)}</p>
              <p class="stock-text mb-0">${getStockMessage(product.stock)}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}