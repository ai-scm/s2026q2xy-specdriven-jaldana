const { pool, query } = require('../config/db');

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT id, usuario_id, total, estado, created_at FROM pedidos WHERE usuario_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error en getOrders:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const pedidoResult = await query(
      'SELECT id, usuario_id, total, estado, created_at FROM pedidos WHERE id = $1 AND usuario_id = $2',
      [id, userId]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = pedidoResult.rows[0];

    const itemsResult = await query(
      `SELECT
        pi.id,
        pi.pedido_id,
        pi.producto_id,
        pi.cantidad,
        pi.precio_unitario,
        p.nombre AS producto_nombre,
        p.imagen_url AS producto_imagen_url,
        p.categoria AS producto_categoria,
        (pi.cantidad * pi.precio_unitario) AS subtotal
      FROM pedido_items pi
      JOIN productos p ON pi.producto_id = p.id
      WHERE pi.pedido_id = $1`,
      [id]
    );

    pedido.items = itemsResult.rows;

    return res.status(200).json(pedido);
  } catch (err) {
    console.error('Error en getOrder:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    // 1. Obtener los ítems del carrito del usuario con detalles del producto
    const cartResult = await client.query(
      `SELECT
        c.id AS carrito_id,
        c.producto_id,
        c.cantidad,
        p.nombre AS producto_nombre,
        p.precio,
        p.stock
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = $1`,
      [userId]
    );

    const cartItems = cartResult.rows;

    // 2. Verificar que el carrito no está vacío
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 3. Verificar stock para cada ítem
    for (const item of cartItems) {
      if (item.cantidad > item.stock) {
        return res.status(400).json({
          error: `Stock insuficiente para "${item.producto_nombre}". Disponible: ${item.stock}, Solicitado: ${item.cantidad}`,
        });
      }
    }

    // 4. Calcular total
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.precio) * item.cantidad, 0);

    // 5. Iniciar transacción
    await client.query('BEGIN');

    // 6. Crear el pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING *',
      [userId, total.toFixed(2), 'pendiente']
    );

    const pedido = pedidoResult.rows[0];

    // 7. Insertar los ítems del pedido
    for (const item of cartItems) {
      await client.query(
        'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedido.id, item.producto_id, item.cantidad, item.precio]
      );
    }

    // 8. Actualizar el stock de los productos
    for (const item of cartItems) {
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [item.cantidad, item.producto_id]
      );
    }

    // 9. Limpiar el carrito del usuario
    await client.query('DELETE FROM carrito WHERE usuario_id = $1', [userId]);

    // 10. Confirmar la transacción
    await client.query('COMMIT');

    // 11. Devolver el pedido creado con sus ítems
    const itemsResult = await query(
      `SELECT
        pi.id,
        pi.pedido_id,
        pi.producto_id,
        pi.cantidad,
        pi.precio_unitario,
        p.nombre AS producto_nombre,
        p.imagen_url AS producto_imagen_url,
        (pi.cantidad * pi.precio_unitario) AS subtotal
      FROM pedido_items pi
      JOIN productos p ON pi.producto_id = p.id
      WHERE pi.pedido_id = $1`,
      [pedido.id]
    );

    pedido.items = itemsResult.rows;

    return res.status(201).json(pedido);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en createOrder:', err);
    return res.status(500).json({ error: 'Error interno del servidor al crear el pedido' });
  } finally {
    client.release();
  }
};

module.exports = { getOrders, getOrder, createOrder };
