const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");

/**
 * Verifica sesión de administrador y redirige si no tiene acceso.
 */
(function verificarAccesoAdmin() {
  if (typeof getUsuarioActivo !== "function" || typeof esUsuarioAdmin !== "function") {
    return;
  }

  if (!esUsuarioAdmin(getUsuarioActivo())) {
    alert("Acceso restringido. Inicia sesión con una cuenta de administrador.");
    window.location.replace("./login.html");
  }
})();

/**
 * Restablece el formulario de producto a su estado inicial.
 */
function resetForm() {
  document.getElementById("productId").value = "";
  form.reset();
  submitBtn.textContent = "Guardar producto";
  if (cancelEditBtn) {
    cancelEditBtn.style.display = "none";
  }
}

/**
 * Carga los datos de un producto en el formulario para editarlo.
 * @param {number} id - Identificador del producto.
 */
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

/**
 * Elimina un producto del catálogo y del carrito si existe.
 * @param {number} id - Identificador del producto.
 */
async function deleteProduct(id) {

  const confirmDelete = confirm(
    "¿Seguro que deseas eliminar este producto?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
      `https://origenesdeployback.onrender.com/productos/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo eliminar el producto");
    }

    alert("Producto eliminado correctamente");

    renderProducts();

  } catch (error) {

    console.error("Error eliminando producto:", error);

    alert("Ocurrió un error al eliminar el producto");
  }
}
// function deleteProduct(id) {
//   const products = getProducts().filter((item) => item.id !== id);
//   saveProducts(products);

//   const cart = getCart().filter((item) => item.productId !== id);
//   saveCart(cart);

//   renderProducts();
// }

/**
 * Renderiza la lista de productos en el panel de administración.
 */
async function renderProducts() {
  if (!productList) return;

  try {
    const response = await fetch("https://origenesdeployback.onrender.com/productos");

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const products = await response.json();

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
              <img src="${product.direccionurl}" alt="${product.nombre}" class="product-image" />
              <div class="card-body">
                <span class="badge-category">${product.categoria}</span>
                <h5 class="card-title">${product.nombre}</h5>
                <p class="card-text">${product.descripcion}</p>
                <p class="price-text">$${Number(product.precio).toLocaleString("es-CO")}</p>
                <p class="stock-text">Stock: ${product.cantidad}</p>

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

  } catch (error) {
    console.error("Error al cargar productos:", error);
    productList.innerHTML = `
      <div class="col-12">
        <div class="empty-state p-4 text-center text-danger">
          Error al cargar los productos. Intenta de nuevo.
        </div>
      </div>
    `;
  }
}
// function renderProducts() {
//   const products = getProducts();

//   if (!productList) return;

//   if (products.length === 0) {
//     productList.innerHTML = `
//       <div class="col-12">
//         <div class="empty-state p-4 text-center">
//           No hay productos aún
//         </div>
//       </div>
//     `;
//     return;
//   }

//   productList.innerHTML = products
//     .map(
//       (product) => `
//         <div class="col-md-6 col-xl-4">
//           <div class="product-card">
//             <img src="${product.image}" alt="${product.name}" class="product-image" />
//             <div class="card-body">
//               <span class="badge-category">${product.category}</span>
//               <h5 class="card-title">${product.name}</h5>
//               <p class="card-text">${product.description}</p>
//               <p class="price-text">$${Number(product.price).toLocaleString("es-CO")}</p>
//               <p class="stock-text">Stock: ${product.stock}</p>

//               <div class="product-actions-inline">
//                 <button class="btn-card-edit" onclick="editProduct(${product.id})">
//                   Editar
//                 </button>
//                 <button class="btn-card-delete" onclick="deleteProduct(${product.id})">
//                   Eliminar
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       `
//     )
//     .join("");
// }

if (form && esUsuarioAdmin(getUsuarioActivo())) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const productData = {
      nombre: document.getElementById("name").value.trim(),
      descripcion: document.getElementById("description").value.trim(),
      precio: Number(document.getElementById("price").value),
      cantidad: Number(document.getElementById("stock").value),
      categoria: document.getElementById("category").value,
      direccionurl: document.getElementById("image").value.trim(),
    };

    console.log(productData);

    try {

      const response = await fetch(
        "https://origenesdeployback.onrender.com/productos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear producto");
      }

      const nuevoProducto = await response.json();

      console.log("Producto creado:", nuevoProducto);

      alert("Producto creado correctamente");

      resetForm();

    } catch (error) {

      console.error(error);

      alert("No se pudo crear el producto");
    }

  });

}

// if (form && esUsuarioAdmin(getUsuarioActivo())) {
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const productId = document.getElementById("productId").value;
//     const productData = {
//       id: productId ? Number(productId) : Date.now(),
//       name: document.getElementById("name").value.trim(),
//       description: document.getElementById("description").value.trim(),
//       price: Number(document.getElementById("price").value),
//       stock: Number(document.getElementById("stock").value),
//       category: document.getElementById("category").value,
//       image: document.getElementById("image").value.trim(),
//     };

//     console.log("Producto guardado:", JSON.stringify(productData, null, 2));

//     const products = getProducts();

//     if (productId) {
//       const updatedProducts = products.map((item) =>
//         item.id === Number(productId) ? productData : item
//       );
//       saveProducts(updatedProducts);
//     } else {
//       products.push(productData);
//       saveProducts(products);
//     }

//     resetForm();
//     renderProducts();
//   });
// }

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", resetForm);
}

if (esUsuarioAdmin(getUsuarioActivo())) {
  resetForm();
  renderProducts();
}
