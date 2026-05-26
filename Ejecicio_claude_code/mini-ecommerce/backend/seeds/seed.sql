-- Seeds: Datos de prueba para Mini E-Commerce
-- Contraseña para todos los usuarios: password123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LWFZys4mtO6

-- Usuarios
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Admin Principal', 'admin@ecommerce.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LWFZys4mtO6', 'admin'),
    ('Admin Secundario', 'admin2@ecommerce.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LWFZys4mtO6', 'admin'),
    ('Juan Cliente', 'juan@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LWFZys4mtO6', 'cliente')
ON CONFLICT (email) DO NOTHING;

-- Productos - Categoría: Electrónica
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria) VALUES
    (
        'Smartphone Pro X',
        'Teléfono inteligente con pantalla AMOLED de 6.5 pulgadas, cámara de 108MP y batería de 5000mAh. Procesador Snapdragon 8 Gen 2.',
        899.99,
        25,
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'Electrónica'
    ),
    (
        'Laptop UltraSlim 15',
        'Portátil ultradelgado con procesador Intel Core i7, 16GB RAM, SSD 512GB y pantalla Full HD de 15.6 pulgadas.',
        1299.99,
        10,
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'Electrónica'
    ),
    (
        'Auriculares Bluetooth Pro',
        'Auriculares inalámbricos con cancelación activa de ruido, 30 horas de autonomía y sonido de alta fidelidad.',
        249.99,
        50,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'Electrónica'
    ),
    (
        'Tablet Creative 10',
        'Tablet de 10 pulgadas con pantalla 2K, stylus incluido, perfecta para diseño y productividad.',
        449.99,
        30,
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        'Electrónica'
    );

-- Productos - Categoría: Ropa
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria) VALUES
    (
        'Camiseta Casual Premium',
        'Camiseta de algodón 100% orgánico, corte regular, disponible en múltiples colores. Lavable a máquina.',
        29.99,
        100,
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        'Ropa'
    ),
    (
        'Jeans Slim Fit Clásico',
        'Pantalón vaquero de corte slim, tela denim premium con elastano para mayor comodidad.',
        79.99,
        60,
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        'Ropa'
    ),
    (
        'Chaqueta Impermeable',
        'Chaqueta cortavientos e impermeable, ideal para actividades al aire libre. Bolsillos con cremallera.',
        119.99,
        40,
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
        'Ropa'
    );

-- Productos - Categoría: Hogar
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria) VALUES
    (
        'Cafetera Automática Deluxe',
        'Cafetera espresso automática con molinillo integrado, pantalla táctil y capacidad para 12 tazas.',
        199.99,
        20,
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        'Hogar'
    ),
    (
        'Juego de Sábanas Premium',
        'Juego completo de sábanas 100% algodón egipcio, 400 hilos. Incluye sábana bajera, encimera y 2 fundas.',
        89.99,
        35,
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        'Hogar'
    ),
    (
        'Lámpara de Escritorio LED',
        'Lámpara LED regulable con temperatura de color ajustable, puerto USB de carga y cuello flexible.',
        59.99,
        45,
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        'Hogar'
    );
