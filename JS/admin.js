const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");

function resetForm() {
  document.getElementById("productId").value = "";
  form.reset();
  submitBtn.textContent = "Guardar producto";
  if (cancelEditBtn) {
    cancelEditBtn.style.display = "none";
  }
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find((item) => item.id === id);

  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock;
  document.getElementById("category").value = product.category;
  document.getElementById("image").value = product.image;

  submitBtn.textContent = "Actualizar producto";
  if (cancelEditBtn) {
    cancelEditBtn.style.display = "inline-block";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  const products = getProducts().filter((item) => item.id !== id);
  saveProducts(products);

  const cart = getCart().filter((item) => item.productId !== id);
  saveCart(cart);

  renderProducts();
}

function renderProducts() {
  const products = getProducts();

  if (!productList) return;

  if (products.length === 0) {
    productList.innerHTML = `
      <div class="col-12">
        <div class="empty-state p-4 text-center">
          No hay productos aún
        </div>
      </div>
    `;
    return;
  }

  productList.innerHTML = products
    .map(
      (product) => `
        <div class="col-md-6 col-xl-4">
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" />
            <div class="card-body">
              <span class="badge-category">${product.category}</span>
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="price-text">$${Number(product.price).toLocaleString("es-CO")}</p>
              <p class="stock-text">Stock: ${product.stock}</p>

              <div class="product-actions-inline">
                <button class="btn-card-edit" onclick="editProduct(${product.id})">
                  Editar
                </button>
                <button class="btn-card-delete" onclick="deleteProduct(${product.id})">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const productId = document.getElementById("productId").value;
    const productData = {
      id: productId ? Number(productId) : Date.now(),
      name: document.getElementById("name").value.trim(),
      description: document.getElementById("description").value.trim(),
      price: Number(document.getElementById("price").value),
      stock: Number(document.getElementById("stock").value),
      category: document.getElementById("category").value,
      image: document.getElementById("image").value.trim()
    };

    const products = getProducts();

    if (productId) {
      const updatedProducts = products.map((item) =>
        item.id === Number(productId) ? productData : item
      );
      saveProducts(updatedProducts);
    } else {
      products.push(productData);
      saveProducts(products);
    }

    resetForm();
    renderProducts();
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", resetForm);
}

resetForm();
renderProducts();