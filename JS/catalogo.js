// const HARDCODED_PRODUCTS = [
//   { id: 101, name: "Ruana De Orígen", price: 285000, stock: 7, image: "https://i.postimg.cc/ZqQ7Bz4x/imagen-19.webp", category: "Moda", description: "Prenda artesanal tejida en lana premium." },
//   { id: 102, name: "Poncho Ancestral", price: 230000, stock: 6, image: "https://i.postimg.cc/W3J90Y1Y/imagen-18.jpg", category: "Moda", description: "Tejido artesanal en telar de pedal." },
//   { id: 103, name: "Brazalete Ondas de Mimbre", price: 240000, stock: 17, image: "https://i.postimg.cc/L8H0GVxL/imagen-07.jpg", category: "Artesanías", description: "Tejido a mano con fibras de mimbre." },
//   { id: 104, name: "Vasijas de Arcilla Esmaltada", price: 350000, stock: 7, image: "https://i.postimg.cc/cLs5PcFY/imagen-08.jpg", category: "Artesanías", description: "Cerámica artesanal elaborada a mano." },
//   { id: 105, name: "Tejido", price: 20000, stock: 8, image: "https://i.postimg.cc/vmh4wtzT/D-NQ-NP-2X-893039-MCO94031182153-102025-F.png", category: "Artesanías", description: "Tejido para matera." },
//   { id: 106, name: "Café Amazonas", price: 50000, stock: 58, image: "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop", category: "Café", description: "Café de origen natural." },
//   { id: 107, name: "Sombrero Vueltiao", price: 70000, stock: 10, image: "https://colombia.co/sites/default/files/marca-pais/media/images/sombrero-vueltiao-colombiano_0.webp", category: "Moda", description: "Sombrero tradicional colombiano tejido a mano." },
//   { id: 108, name: "Set de Joyería Hojas de Otoño", price: 55000, stock: 8, image: "https://i.ebayimg.com/images/g/8okAAeSwYZ9px-3m/s-l1200.webp", category: "Joyería", description: "Accesorio artesanal con diseño colombiano." },
//   { id: 109, name: "Vela Guava Jelly", price: 120000, stock: 10, image: "https://i.postimg.cc/3N0fpjFY/vela-guava-jelly.png", category: "Accesorios", description: "Vela aromática de 12 oz con fragancia tropical." },
//   { id: 110, name: "Pañuelo Tropical", price: 95000, stock: 10, image: "https://www.khamaliShop.com/cdn/shop/products/Pa_uelo-tropical-cabeza-KHAMALI-258183265_1946x.jpg?v=1741892266", category: "Accesorios", description: "Estampado floral en seda satinada." },
//   { id: 111, name: "Brazalete Geometría Ancestral", price: 78000, stock: 5, image: "https://i.etsystatic.com/34393182/r/il/6a5a86/4100564960/il_570xN.4100564960_8r9r.jpg", category: "Accesorios", description: "Tejido a mano con técnica peyote." },
//   { id: 112, name: "Mochila Patrimonio Solar", price: 450000, stock: 3, image: "https://hilosagrado.org/cdn/shop/collections/Mochila-Wayuu-Tejida-Azul-Oscuro-Pompon_grande.png?v=1695335152", category: "Moda", description: "Tejido Wayúu de lujo con paleta minimalista." },
// ];

/**
 * Registra los productos iniciales en localStorage si aún no existen.
 */
// function registerHardcodedProducts() {
//   if (typeof getProducts !== "function" || typeof saveProducts !== "function") {
//     return;
// //   }

//   const existingProducts = getProducts();
//   const existingIds = existingProducts.map((product) => product.id);
//   const newProducts = HARDCODED_PRODUCTS.filter((product) => !existingIds.includes(product.id));

//   if (newProducts.length > 0) {
//     saveProducts([...existingProducts, ...newProducts]);
//   }
// }

/**
 * Renderiza dinámicamente las tarjetas del catálogo desde localStorage.
 */
async function renderCatalog() {
  const catalogContainer = document.getElementById("catalogContainer");

  if (!catalogContainer) return;

  try {
    const response = await fetch("https://origenesdeployback.onrender.com/productos");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const products = await response.json();

    if (products.length === 0) {
      catalogContainer.innerHTML = `
        <div class="col-12">
          <div class="empty-state">
            No hay productos disponibles.
          </div>
        </div>
      `;
      return;
    }

    catalogContainer.innerHTML = products.map(product => `
      <div class="col-md-6 col-lg-4">
        <article class="product-card">
          <img 
            src="${product.direccionurl}" 
            alt="${product.nombre}" 
            class="product-image"
          />

          <div class="card-body">
            <span class="badge-category">${product.categoria}</span>

            <h5 class="card-title">
              ${product.nombre}
            </h5>

            <p class="card-text">
              ${product.descripcion}
            </p>

            <p class="price-text">
              $${Number(product.precio).toLocaleString("es-CO")}
            </p>

            <p class="stock-text">
              Disponibles: ${product.cantidad}
            </p>

            <button 
              class="btn-buy"
              type="button"
                onclick="addToCart(${product.id}, '${product.nombre.replace(/'/g, "\\'")}', ${product.precio}, ${product.cantidad}, '${product.direccionurl}', '${product.descripcion.replace(/'/g, "\\'")}')"
              >
              Agregar al carrito
            </button>
          </div>
        </article>
      </div>
    `).join("");

  } catch (error) {
    console.error("Error cargando productos:", error);

    catalogContainer.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          Error al cargar productos.
        </div>
      </div>
    `;
  }
}
// function renderCatalog() {
//   const catalogContainer = document.getElementById("catalogContainer");

//   if (!catalogContainer || typeof getProducts !== "function") {
//     return;
//   }

//   const products = getProducts();

//   if (products.length === 0) {
//     catalogContainer.innerHTML = `
//       <div class="col-12">
//         <div class="empty-state">
//           No hay productos disponibles en el catálogo todavía.
//         </div>
//       </div>
//     `;
//     return;
//   }

//   catalogContainer.innerHTML = products
//     .map((product) => `
//       <div class="col-md-6 col-lg-4">
//         <article class="product-card">
//           <img src="${product.image}" alt="${product.name}" class="product-image" />
//           <div class="card-body">
//             <span class="badge-category">${product.category}</span>
//             <h5 class="card-title">${product.name}</h5>
//             <p class="card-text">${product.description}</p>
//             <p class="price-text">$${Number(product.price).toLocaleString("es-CO")}</p>
//             <p class="stock-text">Disponibles: ${product.stock}</p>
//             <button class="btn-buy" type="button" onclick="addToCart(${product.id})">
//               Agregar al carrito
//             </button>
//           </div>
//         </article>
//       </div>
//     `)
//     .join("");
// }

// document.addEventListener("DOMContentLoaded", () => {
//   registerHardcodedProducts();
//   renderCatalog();
// });
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
});

window.addEventListener("storage", (event) => {
  if (event.key === "origenes_products") {
    renderCatalog();
  }
});
