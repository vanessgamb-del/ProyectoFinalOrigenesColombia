
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

const products = [
  {
    id: 1,
    name: "Café Premium de Nariño",
    description: "Café colombiano de altura con notas dulces y aroma intenso.",
    price: 45000,
    stock: 10,
    category: "Café",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Mochila Artesanal Wayuu",
    description: "Tejida a mano por artesanas colombianas con diseños tradicionales.",
    price: 120000,
    stock: 6,
    category: "Artesanías",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Chocolate Artesanal Colombiano",
    description: "Chocolate premium elaborado con cacao colombiano de alta calidad.",
    price: 28000,
    stock: 15,
    category: "Alimentos",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80"
  }
];

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
      id: products.length + 1,
      name,
      description,
      price,
      stock,
      category,
      image
    };

    products.push(product);
    renderProducts();
    printProductsJson();
    productForm.reset();
  });

  renderProducts();
  printProductsJson();
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
  if (products.length === 0) {
    productList.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          No hay productos agregados todavía.
        </div>
      </div>
    `;
    return;
  }

  productList.innerHTML = products
    .map((product) => {
      return `
        <div class="col-12 col-md-6">
          <div class="card product-card">
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

function printProductsJson() {
  console.log("Lista de productos en formato JSON:");
  console.log(JSON.stringify(products, null, 2));
}