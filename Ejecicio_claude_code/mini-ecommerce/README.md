# Mini E-Commerce

Aplicacion de comercio electronico completa construida con React, Node.js/Express y PostgreSQL, completamente dockerizada.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 24.0
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.0

No se necesita Node.js, npm ni PostgreSQL instalados localmente.

## Levantar la aplicacion

```bash
# Clonar o acceder al directorio del proyecto
cd mini-ecommerce

# Construir y levantar todos los servicios
docker compose up --build
```

La primera vez tardara algunos minutos mientras Docker descarga las imagenes y compila los contenedores.

## URLs de acceso

| Servicio  | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:5173       |
| Backend   | http://localhost:3000       |
| Base datos| localhost:5432              |

## Credenciales de prueba

Todos los usuarios usan la contrasena: `password123`

| Usuario           | Email                  | Rol    |
|-------------------|------------------------|--------|
| Admin Principal   | admin@ecommerce.com    | admin  |
| Admin Secundario  | admin2@ecommerce.com   | admin  |
| Juan Cliente      | juan@example.com       | cliente|

## Funcionalidades

### Para clientes
- **Catalogo**: Navegar y filtrar productos por categoria
- **Carrito**: Agregar productos, ajustar cantidades, eliminar items
- **Pedidos**: Confirmar compra y ver historial de pedidos

### Para administradores
- Todo lo anterior mas gestion de productos via API
- Crear, actualizar y eliminar productos

## API Endpoints

### Autenticacion
```
POST /api/auth/register   - Crear nueva cuenta
POST /api/auth/login      - Iniciar sesion
```

### Productos (publicos para GET)
```
GET    /api/productos          - Listar todos (filter: ?categoria=X)
GET    /api/productos/:id      - Detalle de producto
POST   /api/productos          - Crear producto (admin)
PUT    /api/productos/:id      - Actualizar producto (admin)
DELETE /api/productos/:id      - Eliminar producto (admin)
```

### Carrito (requiere JWT)
```
GET    /api/carrito      - Ver carrito del usuario
POST   /api/carrito      - Agregar/actualizar item
PUT    /api/carrito/:id  - Actualizar cantidad
DELETE /api/carrito/:id  - Eliminar item
DELETE /api/carrito      - Vaciar carrito
```

### Pedidos (requiere JWT)
```
GET  /api/pedidos      - Historial de pedidos
GET  /api/pedidos/:id  - Detalle de pedido
POST /api/pedidos      - Crear pedido desde carrito
```

## Estructura del proyecto

```
mini-ecommerce/
├── docs/              # Documentacion y diagramas
├── backend/           # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/    # Configuracion de base de datos
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── migrations/    # Schema SQL
│   └── seeds/         # Datos de prueba
├── frontend/          # SPA con React + Vite
│   └── src/
│       ├── api/       # Cliente Axios
│       ├── components/
│       ├── context/   # Auth y Cart contexts
│       └── pages/
└── docker-compose.yml
```

## Detener la aplicacion

```bash
# Detener los contenedores
docker compose down

# Detener y eliminar el volumen de datos (borra la base de datos)
docker compose down -v
```

## Stack tecnico

- **Frontend**: React 18, Vite, React Router DOM 6, Axios
- **Backend**: Node.js, Express 4, pg, jsonwebtoken, bcryptjs
- **Base de datos**: PostgreSQL 16
- **Deploy**: Docker + Docker Compose
