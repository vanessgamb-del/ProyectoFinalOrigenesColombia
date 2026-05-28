# Orígenes Colombia — Frontend

Proyecto final de **Generation Colombia**. Ecommerce de productos artesanales colombianos con catálogo, carrito, autenticación offline y panel de administración.

## Equipo

- Jessica Acevedo
- Angie Gamboa
- Manuel Gómez
- Luis Salgado
- Lukas Muñoz

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge).
- Servidor HTTP local (recomendado; `file://` puede limitar algunas funciones).

## Cómo ejecutar el proyecto

1. Clona o descarga este repositorio.
2. Abre una terminal en la raíz del proyecto.
3. Inicia un servidor estático, por ejemplo:

```bash
# Con Python 3
python -m http.server 5500

# Con Node.js (npx)
npx serve .
```

4. Abre en el navegador: `http://localhost:5500`

La página principal es `index.html`.

## Estructura del proyecto

```
origenesFrontend/
├── index.html          # Página de inicio
├── HTML/               # Vistas secundarias (catálogo, login, admin, etc.)
├── JS/                 # Lógica JavaScript modular
├── CSS/                # Estilos por sección
├── IMG/                # Iconos, logo e imágenes locales
├── database/           # Diagrama ER y scripts SQL (PostgreSQL)
└── docs/               # Requerimientos del proyecto
```

## Módulos principales

| Módulo | Archivos | Descripción |
|---|---|---|
| Catálogo | `HTML/catalogo.html`, `JS/catalogo.js` | 12+ productos con persistencia en `localStorage` |
| Carrito | `JS/carrito.js`, `JS/storage.js` | Drawer lateral con totales y persistencia |
| Registro / Login | `HTML/registro.html`, `HTML/login.html` | Usuarios en `localStorage` (fase offline) |
| Contacto | `HTML/contactenos.html`, `JS/contactenos.js` | Validación JS + envío con Formspree |
| Admin | `HTML/admin.html`, `JS/admin.js` | CRUD de productos (requiere sesión admin) |
| Sobre Orígenes | `HTML/sobreorigenes.html`, `JS/sobreorigenes.js` | Equipo, misión y visión |

## Credenciales de prueba

### Administrador (panel protegido)

| Campo | Valor |
|---|---|
| Correo | `admin@mail.com` |
| Contraseña | `123456` |

El enlace **Administrador** en navbar y footer solo es visible tras iniciar sesión con esta cuenta.

### Usuario normal

Puedes crear una cuenta nueva en `HTML/registro.html` (nombre, teléfono, email y contraseña).

## Persistencia local (localStorage)

| Clave | Contenido |
|---|---|
| `origenes_products` | Catálogo de productos |
| `origenes_cart` | Ítems del carrito |
| `origenes_usuarios` | Usuarios registrados |
| `usuarioActivo` | Sesión actual |

## Base de datos (Backend)

Scripts PostgreSQL en `database/`:

- `diagramaER.jpg` — Diagrama entidad-relación
- `origenesColombia.sql` — DDL y DML con datos de prueba

## Dependencias externas (CDN)

- [Bootstrap 5.3.3](https://getbootstrap.com/)
- [Google Fonts — Montserrat](https://fonts.google.com/)
- [Font Awesome 6.5](https://fontawesome.com/) (página Sobre Orígenes)
- [Formspree](https://formspree.io/) (formulario de contacto)

## Notas

- El frontend opera en modo **offline** con `localStorage`; la integración con API/PostgreSQL está planificada para una fase posterior.
- Para probar el panel admin: inicia sesión con `admin@mail.com` y luego navega a **Administrador**.
