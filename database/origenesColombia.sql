CREATE TABLE roles (
	id_rol SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	descripcion TEXT NOT NULL
);

CREATE TABLE usuarios (
	id_usuario SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(50) NOT NULL,
	correo VARCHAR(100) UNIQUE,
	direccion VARCHAR(100),
	telefono VARCHAR(20),
	fecha_registro DATE DEFAULT CURRENT_DATE,
	contrasena VARCHAR(255) NOT NULL,
	id_rol INTEGER NOT NULL,
	CONSTRAINT usuario_rol_id_fkey
	FOREIGN KEY (id_rol)
	REFERENCES roles(id_rol)
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    fecha_pedido TIMESTAMP NOT NULL,
    estado VARCHAR(20),
    total NUMERIC(10,2),
    direccion_envio VARCHAR(100),
    id_usuario INTEGER NOT NULL,
    CONSTRAINT pedido_usuario_id_fkey
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT 
);

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(50) NOT NULL,
	precio NUMERIC(10,2) NOT NULL,
    estado VARCHAR(30),
    marca VARCHAR(20),
    id_categoria INTEGER NOT NULL,
    CONSTRAINT producto_categoria_id_fkey
    FOREIGN KEY (id_categoria)
    REFERENCES categorias(id_categoria)
);

CREATE TABLE detalle_pedidos (
	id_detalle SERIAL PRIMARY KEY,
	id_pedido INTEGER NOT NULL,
	id_producto INTEGER NOT NULL,
	cantidad INTEGER,
	CONSTRAINT detalle_pedido_id_fkey
	FOREIGN KEY (id_pedido)
	REFERENCES pedidos(id_pedido),
	CONSTRAINT detalle_producto_id_fkey
	FOREIGN KEY (id_producto)
	REFERENCES productos(id_producto)
);

INSERT INTO roles (nombre, descripcion) VALUES 
('Admin', 'Acceso total a todas las funciones del sistema'),
('Moderador', 'Puede gestionar contenido y usuarios, pero con restricciones'),
('Usuario', 'Cliente estándar con acceso a compras y perfil'),
('Editor', 'Encargado de gestionar el catálogo de productos y descripciones'),
('Invitado', 'Solo lectura, puede navegar pero no realizar acciones');

INSERT INTO usuarios (nombre, apellido, correo, direccion, telefono, contrasena, id_rol) VALUES 
('Angie', 'Gamboa', 'admin@correo.com', 'Calle 5, Cali', '3001234567', '123456', 1),
('Vanessa', 'Rivas', 'vanessa@correo.com', 'Av. Pasoancho, Cali', '3007654321', 'root456', 2),
('Carlos', 'Pérez', 'carlos@correo.com', 'Barrio San Antonio, Cali', '3151112233', 'user789', 3),
('Elena', 'Martínez', 'elena@correo.com', 'Ciudad Jardín, Cali', '3104445566', 'pass321', 4),
('Miguel', 'Rodríguez', 'miguel@correo.com', 'El Peñón, Cali', '3207778899', 'mike999', 5);

INSERT INTO pedidos (fecha_pedido, estado, total, direccion_envio, id_usuario) VALUES 
('2026-05-10', 'Entregado', 450500.00, 'Barrio San Antonio, Cali', 3),
('2026-05-12', 'Enviado', 850000.00, 'Ciudad Jardín, Cali', 4),
('2026-05-14', 'Pendiente', 210999.00, 'El Peñón, Cali', 5),
('2026-05-14', 'Procesando', 445200.00, 'Barrio San Antonio, Cali', 3),
('2026-05-14', 'Cancelado', 120000.00, 'Calle 5, Cali', 1);

INSERT INTO categorias (nombre, descripcion) VALUES 
('Café', 'Granos de especialidad y molidos de origen'),
('Artesanías', 'Productos hechos a mano por comunidades locales'),
('Alimentos', 'Dulces, panela y productos orgánicos frescos'),
('Moda', 'Productos hechos a manos por comunidades locales'),
('Decoración', 'Decoración y utensilios con diseño tradicional');

INSERT INTO productos (nombre_producto, precio, estado, marca, id_categoria) VALUES 
('Café Especial de Huila', 45000.00, 'Disponible', 'Orígenes H', 3),
('Mochila Wayuu Grande', 180000.00, 'Disponible', 'Artesanías W', 1),
('Panela Orgánica 1kg', 12000.00, 'Disponible', 'DulceCampo', 2),
('Sombrero Vueltiao 21', 350000.00, 'Bajo Stock', 'Artesanías C', 1),
('Achiote en Grano', 8500.00, 'Disponible', 'SaborCol', 2);

INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad) VALUES 
(1, 4, 2),
(1, 2, 1),
(2, 5, 5),
(3, 4, 1),
(4, 3, 10);