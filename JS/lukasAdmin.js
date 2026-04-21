// Arreglo donde guardaremos todos los objetos creados
const listaProductos = [];

document.getElementById('formPublicacion').addEventListener('submit', function(e) {
    e.preventDefault(); // Detenemos la recarga de la página

    // 1. Capturar valores de los inputs
    const nombre = document.getElementById('nombre').value;
    const precioRaw = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const urlImagen = document.getElementById('urlImagen').value;
    const descripcion = document.getElementById('descripcion').value;

    // 2. Procesar el precio para formato colombiano
    const precioNumerico = parseInt(precioRaw);
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precioNumerico);

    // 3. Crear el objeto del modelo
    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: precioNumerico,
        precioFormateado: formatoCOP, // Para que en consola se vea como $ 85.000
        categoria: categoria,
        imagen: urlImagen,
        descripcion: descripcion
    };

    // 4. Agregar a la lista
    listaProductos.push(nuevoProducto);

    // 5. MOSTRAR EN CONSOLA (Requisito Tarea 7)
    console.log("--- Tarea 7: Listado de Objetos en JSON ---");
    console.log(JSON.stringify(listaProductos, null, 2));

    // Opcional: Feedback visual
    alert(`Producto "${nombre}" registrado exitosamente en COP.`);
    
    // Limpiar el formulario para el siguiente ingreso
    this.reset();
});