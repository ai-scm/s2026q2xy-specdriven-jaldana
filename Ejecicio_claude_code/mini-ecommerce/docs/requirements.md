# Requisitos del Proyecto: Mini E-Commerce

## Objetivo del Proyecto

Desarrollar una aplicación de comercio electrónico funcional que permita a los usuarios explorar un catálogo de productos, gestionar un carrito de compras y realizar pedidos. El sistema contará con autenticación segura basada en JWT y estará completamente dockerizado para facilitar su despliegue.

## Stack Tecnológico

### Frontend
- **React 18** con Vite como bundler
- **React Router DOM 6** para enrutamiento SPA
- **Axios** para comunicación HTTP con el backend

### Backend
- **Node.js** con framework **Express**
- **pg** (node-postgres) para la conexión a la base de datos
- **jsonwebtoken** para generación y verificación de tokens JWT
- **bcryptjs** para hashing seguro de contraseñas
- **cors** para manejo de Cross-Origin Resource Sharing
- **dotenv** para gestión de variables de entorno

### Base de Datos
- **PostgreSQL 16** como sistema de gestión de base de datos relacional

### Despliegue
- **Docker** y **Docker Compose** para contenerización y orquestación

## Funcionalidades Principales

### 1. Catálogo de Productos
- Visualización de todos los productos disponibles en una cuadrícula responsiva
- Filtrado de productos por categoría (Electrónica, Ropa, Hogar, etc.)
- Información detallada de cada producto: nombre, descripción, precio, stock disponible e imagen
- Indicador visual cuando un producto está agotado (stock = 0)

### 2. Carrito de Compras
- Agregar productos al carrito desde el catálogo
- Actualizar la cantidad de cada ítem en el carrito
- Eliminar ítems individuales del carrito
- Visualización del subtotal por ítem y el total general
- Persistencia del carrito en la base de datos (asociado al usuario autenticado)

### 3. Proceso de Compra
- Creación de pedidos a partir del carrito actual
- Verificación de stock disponible antes de confirmar el pedido
- Actualización automática del stock al confirmar la compra
- Limpieza automática del carrito tras realizar el pedido
- Cálculo automático del total del pedido

### 4. Historial de Pedidos
- Visualización del historial completo de pedidos del usuario
- Detalle de cada pedido: productos comprados, cantidades y precios unitarios
- Estado del pedido (pendiente, procesando, enviado, entregado)
- Fecha y total de cada pedido

### 5. Autenticación y Autorización
- Registro de nuevos usuarios con validación de datos
- Inicio de sesión con email y contraseña
- Protección de rutas que requieren autenticación
- Sistema de roles: `cliente` (acceso normal) y `admin` (gestión de productos)

## Seguridad

### JWT (JSON Web Tokens)
- Todos los tokens se firman con una clave secreta configurable
- Los tokens tienen una vigencia de 7 días por defecto
- El token se envía en el header `Authorization: Bearer <token>`
- Las rutas protegidas verifican el token en cada solicitud

### Contraseñas
- Las contraseñas se hashean con bcryptjs antes de almacenarse
- Factor de coste bcrypt: 10 rondas
- Las contraseñas en texto plano nunca se almacenan ni se devuelven en las respuestas

### Control de Acceso
- Los endpoints de modificación de productos requieren rol `admin`
- Los endpoints del carrito y pedidos requieren autenticación (cualquier rol)
- Los endpoints de consulta de productos son públicos

## Despliegue con Docker

### Servicios
1. **postgres**: Base de datos PostgreSQL 16
   - Inicialización automática con migraciones y datos de prueba
   - Volumen persistente para los datos
   - Health check para garantizar disponibilidad antes de iniciar el backend

2. **backend**: API REST en Node.js
   - Se construye desde el Dockerfile en `./backend`
   - Depende del servicio `postgres` (condición: healthy)
   - Expone el puerto 3000

3. **frontend**: Aplicación React con Vite
   - Se construye desde el Dockerfile en `./frontend`
   - Proxy de `/api` hacia el backend
   - Expone el puerto 5173

### Comando de Despliegue
```bash
docker compose up --build
```

## Modelo de Datos

- **usuarios**: Almacena información de los usuarios registrados
- **productos**: Catálogo de productos disponibles
- **carrito**: Items en el carrito de cada usuario (persistente)
- **pedidos**: Historial de órdenes de compra
- **pedido_items**: Detalle de productos en cada pedido

## Restricciones y Consideraciones

- Un usuario solo puede tener un ítem por producto en su carrito (UNIQUE constraint)
- Al agregar un producto ya existente en el carrito, se suma la cantidad
- No se puede realizar un pedido si el carrito está vacío
- No se puede agregar más unidades de las disponibles en stock
- Los precios en pedido_items se guardan al momento de la compra (precio histórico)
