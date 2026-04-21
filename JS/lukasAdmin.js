// 1. Al iniciar, intentamos cargar lo que ya esté en LocalStorage
// Si no hay nada, inicializamos el arreglo vacío
const listaProductos = JSON.parse(localStorage.getItem('productosAdmin')) || [];

document.getElementById('formPublicacion').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precioRaw = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const urlImagen = document.getElementById('urlImagen').value;
    const descripcion = document.getElementById('descripcion').value;

    const precioNumerico = parseInt(precioRaw);
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precioNumerico);

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: precioNumerico,
        precioFormateado: formatoCOP,
        categoria: categoria,
        imagen: urlImagen,
        descripcion: descripcion
    };

    // 2. Agregar a la lista
    listaProductos.push(nuevoProducto);

    // 3. GUARDAR EN LOCALSTORAGE (Para que no se borre al refrescar)
    localStorage.setItem('productosAdmin', JSON.stringify(listaProductos));

    // 4. MOSTRAR EN CONSOLA (Entregable cumplido)
    console.log("--- Tarea 7: Listado de Objetos en JSON ---");
    console.log(JSON.stringify(listaProductos, null, 2));

    alert(`Producto "${nombre}" registrado exitosamente.`);
    
    this.reset();
});

console.log("Carga de la lista desde el localstorage", JSON.stringify(listaProductos, null, 2));