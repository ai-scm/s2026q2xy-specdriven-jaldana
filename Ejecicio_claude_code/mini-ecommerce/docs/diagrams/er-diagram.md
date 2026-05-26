# Diagrama Entidad-Relación: Mini E-Commerce

```mermaid
erDiagram
    usuarios {
        serial id PK
        varchar nombre
        varchar email UK
        varchar password_hash
        varchar rol
        timestamp created_at
    }

    productos {
        serial id PK
        varchar nombre
        text descripcion
        numeric precio
        int stock
        varchar imagen_url
        varchar categoria
        timestamp created_at
    }

    carrito {
        serial id PK
        int usuario_id FK
        int producto_id FK
        int cantidad
        timestamp created_at
        timestamp updated_at
    }

    pedidos {
        serial id PK
        int usuario_id FK
        numeric total
        varchar estado
        timestamp created_at
    }

    pedido_items {
        serial id PK
        int pedido_id FK
        int producto_id FK
        int cantidad
        numeric precio_unitario
    }

    usuarios ||--o{ carrito : "tiene"
    productos ||--o{ carrito : "incluido en"
    usuarios ||--o{ pedidos : "realiza"
    pedidos ||--|{ pedido_items : "contiene"
    productos ||--o{ pedido_items : "referenciado en"
```

## Descripción de Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| usuarios → carrito | 1 a N | Un usuario puede tener múltiples ítems en su carrito |
| productos → carrito | 1 a N | Un producto puede estar en el carrito de múltiples usuarios |
| usuarios → pedidos | 1 a N | Un usuario puede tener múltiples pedidos |
| pedidos → pedido_items | 1 a N (obligatorio) | Un pedido debe tener al menos un ítem |
| productos → pedido_items | 1 a N | Un producto puede estar en múltiples ítems de pedidos |

## Restricciones Especiales

- `carrito`: UNIQUE(usuario_id, producto_id) — un usuario solo puede tener una entrada por producto
- `carrito`: ON DELETE CASCADE desde usuarios y productos
- `pedido_items`: ON DELETE CASCADE desde pedidos
- `pedido_items`: precio_unitario almacena el precio al momento de la compra (histórico)
- `usuarios.rol`: valor por defecto 'cliente', puede ser 'admin'
- `pedidos.estado`: valor por defecto 'pendiente'
