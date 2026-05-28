Evaluar siempre la aplicación con respecto a:
- Cumple con los @docs/requerimientos.md 
- Funciona correctamente
- Bugs presentes para corregir por orden de prioridad
- Mantener una sitaxis de nivel de desarrolladores Junior
- Actualiza el archivo README
- Comenta el código adecuadamente usando docstrings

# Documento de Requerimientos y Reglas de Negocio — Orígenes Colombia
Este documento consolida los entregables funcionales, flujos de trabajo y validaciones técnicas requeridas para el Frontend y Backend del proyecto final. Sirve como base de contexto técnico para desarrolladores y herramientas de IA (Cursor/Copilot).

---

## 1. Arquitectura de Navegación y Estructura Base
- **Responsividad:** Toda la interfaz debe ser adaptable (Mobile, Tablet, Desktop) utilizando Bootstrap y consultas de medios personalizadas.
- **Flujo Centralizado:** El Navbar y el Footer deben conectar unificadamente los siguientes módulos:
  - `Home / Catálogo`
  - `Sobre Nosotros` (Descripción de marca, biografías, fotos del equipo y roles).
  - `Contacto`
  - `Registro / Login`
  - `Panel de Administración`

---

## 2. Módulos y Requerimientos Funcionales (Frontend)

### A. Módulo de Contacto (`contactenos.html` / `contactenos.js`)
- **Campos del Formulario (Inputs Mínimos):**
  - Nombre completo.
  - Correo electrónico.
  - Teléfono.
  - Mensaje.
- **Validaciones Técnicas (JS):**
  - Validación en el evento `submit` (o *inputs* en tiempo real) comprobando tipos de datos correctos mediante Expresiones Regulares (Regex) para correos y números telefónicos.
  - Bloqueo de envío si existen campos vacíos o incorrectos.
- **Integración Terceros:** Una vez superadas las validaciones frontend, el formulario debe despachar los datos usando la herramienta **Formspree**.

### B. Módulo de Autenticación de Usuarios

#### Registro (`registro.html` / `registro.js`)
- **Campos Solicitados:** Nombre completo, Número de teléfono, Email (que operará como nombre de usuario), Contraseña y Confirmación de contraseña.
- **Lógica Frontend:** 1. Validar coincidencia de contraseñas y formatos seguros.
  2. Almacenar temporalmente los datos estructurados en un objeto JSON.
  3. Guardar el objeto en `localStorage` (fase offline) previo a la migración API.

#### Inicio de Sesión (`login.html` / `login.js`)
- **Campos Solicitados:** Email / Nombre de usuario y Contraseña.
- **Lógica de Validación:**
  - Control de campos vacíos.
  - Verificación de credenciales contra datos prealmacenados (`localStorage` o endpoints de autenticación).
  - Lanzamiento de alertas dinámicas (*Inicio de sesión exitoso* o *Usuario/Contraseña inválidos*).
- **Manejo del Estado Global (Nav):** Tras el login exitoso, redirigir a la página de inicio y **modificar dinámicamente el Navbar** para reflejar el estado de sesión activa del usuario, habilitando o deshabilitando acciones exclusivas.

### C. Catálogo de Productos y Carrito de Compras

#### Catálogo (`catalogo.html` / `catalogo.js`)
- **Estado Inicial:** Mínimo 10 productos cargados directamente en el código estático para demostraciones rápidas.
- **Persistencia Dinámica:** Al cargar la página, una función inicializadora debe recuperar los productos guardados en el almacenamiento, renderizando dinámicamente las tarjetas (Cards) con el diseño maquetado en los Wireframes (Figma).

#### Panel de Administración (`admin.html` / `admin.js`)
- **Formulario de Carga (CRUD):** Contiene campos para agregar elementos al inventario (Nombre, precio, categoría, stock, descripción, URL de imagen).
- **Lógica:** Capturar los datos del formulario, empaquetarlos en formato JSON (verificables mediante consola) e inyectarlos tanto en la vista activa como en el arreglo persistente del `localStorage`.

#### Carrito de Compras (`carrito.js` / Interfaz lateral o vista)
- **Campos Visuales por Ítem:** Imagen, nombre, descripción corta, precio unitario y cantidad.
- **Interactividad Requerida:**
  - Botones de incremento y decremento de unidades por producto.
  - Opción de remoción completa de un ítem.
  - Recálculo acumulador automático del monto total de la orden en tiempo real ante cualquier cambio de estado.
- **Persistencia:** Guardar el estado exacto de los elementos seleccionados en el `localStorage` para tolerar recargas de página sin pérdida de datos del cliente.

---

## 3. Infraestructura de Datos y Backend (PostgreSQL)
- **Motor de Base de Datos:** PostgreSQL.
- **Entregables de Base de Datos:**
  - Diagrama Entidad-Relación (Formato relacional exportado en imagen).
  - Scripts SQL de definición de datos (DDL): Tablas de usuarios, roles, categorías, productos, pedidos y detalles de pedidos con llaves primarias, foráneas y restricciones de integridad.
  - Scripts SQL de manipulación de datos (DML): Población inicial de prueba con un mínimo de **5 entradas/registros por cada tabla**.