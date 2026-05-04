// Hacemos esta seudo base de datos para poder guardarla en localStorage para que addToCart() los pueda encontrar

const HARDCODED_PRODUCTS = [
  { id: 101, name: "Ruana De Orígen",             price: 285000, stock: 7,  image: "https://i.postimg.cc/ZqQ7Bz4x/imagen-19.webp", category: "Moda",       description: "Prenda artesanal tejida en lana premium." },
  { id: 102, name: "Poncho Ancestral",             price: 230000, stock: 6,  image: "https://i.postimg.cc/W3J90Y1Y/imagen-18.jpg",  category: "Moda",       description: "Tejido artesanal en telar de pedal." },
  { id: 103, name: "Brazalete Ondas de Mimbre",    price: 240000, stock: 17, image: "https://i.postimg.cc/L8H0GVxL/imagen-07.jpg",  category: "Artesanías", description: "Tejido a mano con fibras de mimbre." },
  { id: 104, name: "Vasijas de Arcilla Esmaltada", price: 350000, stock: 7,  image: "https://i.postimg.cc/cLs5PcFY/imagen-08.jpg",  category: "Artesanías", description: "Cerámica artesanal elaborada a mano." },
  { id: 105, name: "Tejido",                       price: 20000,  stock: 8,  image: "https://vitrina-emprendimiento-rural.aureliolllano.org.co/wp-content/uploads/2023/03/Producto-tejidos-de-macrame-Vivero-paraiso-del-cartama.jpg", category: "Artesanías", description: "Tejido para matera." },
  { id: 106, name: "Café Amazonas",                price: 50000,  stock: 58, image: "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop", category: "Café", description: "Café de origen natural." },
  { id: 107, name: "Sombrero Vueltiao",            price: 70000,  stock: 10, image: "https://colombia.co/sites/default/files/marca-pais/media/images/sombrero-vueltiao-colombiano_0.webp", category: "Moda", description: "Sombrero tradicional colombiano tejido a mano." },
  { id: 108, name: "Set de Joyería Hojas de Otoño", price: 55000, stock: 8,  image: "https://i.ebayimg.com/images/g/8okAAeSwYZ9px-3m/s-l1200.webp", category: "Joyería", description: "Accesorio artesanal con diseño colombiano." },
  { id: 109, name: "Vela Guava Jelly",             price: 120000, stock: 10, image: "https://i.postimg.cc/Bvs3tDZH/imagen-30.webp", category: "Accesorios", description: "Vela aromática de 12 oz con fragancia tropical." },
  { id: 110, name: "Pañuelo Tropical",             price: 95000,  stock: 10, image: "https://www.khamaliShop.com/cdn/shop/products/Pa_uelo-tropical-cabeza-KHAMALI-258183265_1946x.jpg?v=1741892266", category: "Accesorios", description: "Estampado floral en seda satinada." },
  { id: 111, name: "Brazalete Geometría Ancestral", price: 78000, stock: 5,  image: "https://i.etsystatic.com/34393182/r/il/6a5a86/4100564960/il_570xN.4100564960_8r9r.jpg", category: "Accesorios", description: "Tejido a mano con técnica peyote." },
  { id: 112, name: "Mochila Patrimonio Solar",     price: 450000, stock: 3,  image: "https://hilosagrado.org/cdn/shop/collections/Mochila-Wayuu-Tejida-Azul-Oscuro-Pompon_grande.png?v=1695335152", category: "Moda", description: "Tejido Wayúu de lujo con paleta minimalista." }
];

(function registrarHardcodeados() {
  const existentes = getProducts();
  const idsExistentes = existentes.map(p => p.id);
  const nuevos = HARDCODED_PRODUCTS.filter(p => !idsExistentes.includes(p.id));
  if (nuevos.length > 0) saveProducts([...existentes, ...nuevos]);
})();

// --- Lo que ya teníamos sigue exactamente igual abajo ---

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

document.addEventListener("DOMContentLoaded", function () {
  const shouldOpenCart =
    localStorage.getItem("openCartAfterRegister") === "true" ||
    new URLSearchParams(window.location.search).get("openCart") === "true";

  if (!shouldOpenCart) {
    return;
  }

  localStorage.removeItem("openCartAfterRegister");

  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartDrawer) {
    cartDrawer.classList.add("open");
    cartDrawer.classList.add("cart-drawer-open");
  }

  if (cartOverlay) {
    cartOverlay.classList.add("show");
    cartOverlay.classList.add("cart-overlay-show");
  }
});
