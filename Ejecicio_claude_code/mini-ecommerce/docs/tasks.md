# Tareas del Proyecto: Mini E-Commerce

## 1. Configuración Inicial

- [ ] Crear estructura de directorios del proyecto
- [ ] Inicializar repositorio Git
- [ ] Configurar `.gitignore` para Node.js y variables de entorno
- [ ] Crear archivo `docker-compose.yml` con los tres servicios
- [ ] Crear archivos `.env.example` para el backend
- [ ] Documentar requisitos en `docs/requirements.md`
- [ ] Crear diagrama ER en `docs/diagrams/er-diagram.md`

## 2. Base de Datos

- [ ] Escribir migración `001_init.sql` con las 5 tablas
  - [ ] Tabla `usuarios`
  - [ ] Tabla `productos`
  - [ ] Tabla `carrito` con constraint UNIQUE(usuario_id, producto_id)
  - [ ] Tabla `pedidos`
  - [ ] Tabla `pedido_items`
- [ ] Escribir seeds con datos de prueba
  - [ ] 2 usuarios administradores
  - [ ] 1 usuario cliente
  - [ ] 10 productos en 3 categorías
- [ ] Verificar que el orden de creación de tablas respeta las FK
- [ ] Validar que las migraciones se ejecutan correctamente al iniciar Docker

## 3. Autenticación (Backend)

- [ ] Configurar pool de conexión a PostgreSQL en `src/config/db.js`
- [ ] Implementar middleware de autenticación JWT en `src/middleware/auth.middleware.js`
  - [ ] Verificar token Bearer en header Authorization
  - [ ] Adjuntar usuario decodificado a `req.user`
  - [ ] Middleware `isAdmin` para verificar rol
- [ ] Implementar `auth.controller.js`
  - [ ] Función `register`: hashear contraseña, insertar usuario, devolver JWT
  - [ ] Función `login`: buscar usuario, comparar hash, devolver JWT
- [ ] Configurar rutas en `auth.routes.js`
- [ ] Probar endpoints con herramienta HTTP (Postman/curl)

## 4. Módulo Productos (Backend)

- [ ] Implementar `productos.controller.js`
  - [ ] `getAll`: listar productos con filtro opcional por categoría
  - [ ] `getById`: obtener producto por ID
  - [ ] `create`: crear producto (solo admin)
  - [ ] `update`: actualizar producto (solo admin)
  - [ ] `remove`: eliminar producto (solo admin)
- [ ] Configurar rutas en `productos.routes.js`
  - [ ] GET públicos sin middleware
  - [ ] POST/PUT/DELETE con `auth` + `isAdmin`
- [ ] Validar respuestas y códigos HTTP

## 5. Módulo Carrito (Backend)

- [ ] Implementar `carrito.controller.js`
  - [ ] `getCart`: obtener carrito del usuario con JOIN a productos
  - [ ] `addItem`: agregar/actualizar ítem con ON CONFLICT
  - [ ] `updateItem`: actualizar cantidad verificando propiedad
  - [ ] `removeItem`: eliminar ítem verificando propiedad
  - [ ] `clearCart`: eliminar todos los ítems del usuario
- [ ] Configurar rutas en `carrito.routes.js` (todas con middleware `auth`)
- [ ] Probar flujo completo: agregar → actualizar → eliminar

## 6. Módulo Pedidos (Backend)

- [ ] Implementar `pedidos.controller.js`
  - [ ] `getOrders`: historial de pedidos del usuario
  - [ ] `getOrder`: detalle de pedido con ítems y productos
  - [ ] `createOrder`: transacción completa
    - [ ] Verificar carrito no vacío
    - [ ] Verificar stock disponible
    - [ ] Calcular total
    - [ ] INSERT en pedidos
    - [ ] INSERT en pedido_items
    - [ ] UPDATE stock de productos
    - [ ] DELETE carrito del usuario
    - [ ] Manejo de errores con ROLLBACK
- [ ] Configurar rutas en `pedidos.routes.js` (todas con middleware `auth`)
- [ ] Probar flujo completo: carrito → pedido → verificar stock actualizado

## 7. Frontend - Páginas y Componentes

- [ ] Configurar proyecto Vite + React
- [ ] Implementar `src/api/client.js` con interceptores Axios
- [ ] Implementar `AuthContext.jsx`
  - [ ] Estado de usuario, login, register, logout
  - [ ] Persistencia en localStorage
- [ ] Implementar `CartContext.jsx`
  - [ ] Estado del carrito, fetchCart, addToCart, updateItem, removeItem, clearCart
- [ ] Implementar componentes
  - [ ] `Navbar.jsx` con navegación y badge de carrito
  - [ ] `ProductCard.jsx` con botón "Agregar al carrito"
  - [ ] `CartItem.jsx` con control de cantidad
- [ ] Implementar páginas
  - [ ] `Login.jsx` con formulario y redirección
  - [ ] `Register.jsx` con validación de contraseñas
  - [ ] `Catalog.jsx` con filtros por categoría
  - [ ] `Cart.jsx` con resumen y botón de compra
  - [ ] `Orders.jsx` con historial expandible
- [ ] Configurar rutas en `App.jsx` con rutas protegidas

## 8. Dockerización

- [ ] Crear `Dockerfile` para el backend (Node 20 Alpine)
- [ ] Crear `Dockerfile` para el frontend (Node 20 Alpine)
- [ ] Verificar proxy de Vite hacia el backend en Docker
- [ ] Configurar health check para PostgreSQL
- [ ] Verificar dependencias entre servicios (`depends_on`)
- [ ] Probar `docker compose up --build` completo
- [ ] Verificar acceso a `http://localhost:5173` (frontend)
- [ ] Verificar acceso a `http://localhost:3000` (backend API)
- [ ] Probar flujo completo: registro → login → catálogo → carrito → pedido

## 9. README y Documentación

- [ ] Escribir `README.md` con instrucciones de despliegue
- [ ] Documentar credenciales de prueba
- [ ] Documentar endpoints de la API
- [ ] Revisar diagrama ER
