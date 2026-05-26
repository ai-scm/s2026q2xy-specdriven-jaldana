const { query } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT
        c.id,
        c.usuario_id,
        c.producto_id,
        c.cantidad,
        c.created_at,
        c.updated_at,
        p.nombre AS producto_nombre,
        p.descripcion AS producto_descripcion,
        p.precio AS producto_precio,
        p.stock AS producto_stock,
        p.imagen_url AS producto_imagen_url,
        p.categoria AS producto_categoria,
        (c.cantidad * p.precio) AS subtotal
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = $1
      ORDER BY c.created_at ASC`,
      [userId]
    );

    const items = result.rows;
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    return res.status(200).json({ items, total: total.toFixed(2) });
  } catch (err) {
    console.error('Error en getCart:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { producto_id, cantidad } = req.body;

    if (!producto_id || !cantidad) {
      return res.status(400).json({ error: 'producto_id y cantidad son requeridos' });
    }

    const qty = parseInt(cantidad);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

    const productResult = await query('SELECT id, stock FROM productos WHERE id = $1', [producto_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = productResult.rows[0];
    if (product.stock < qty) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${product.stock}` });
    }

    const result = await query(
      `INSERT INTO carrito (usuario_id, producto_id, cantidad, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (usuario_id, producto_id)
       DO UPDATE SET
         cantidad = carrito.cantidad + EXCLUDED.cantidad,
         updated_at = NOW()
       RETURNING *`,
      [userId, producto_id, qty]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error en addItem:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined || cantidad === null) {
      return res.status(400).json({ error: 'La cantidad es requerida' });
    }

    const qty = parseInt(cantidad);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

    const cartItem = await query(
      'SELECT c.id, c.producto_id FROM carrito c WHERE c.id = $1 AND c.usuario_id = $2',
      [id, userId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Ítem del carrito no encontrado' });
    }

    const productId = cartItem.rows[0].producto_id;
    const productResult = await query('SELECT stock FROM productos WHERE id = $1', [productId]);
    const stock = productResult.rows[0].stock;

    if (qty > stock) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${stock}` });
    }

    const result = await query(
      'UPDATE carrito SET cantidad = $1, updated_at = NOW() WHERE id = $2 AND usuario_id = $3 RETURNING *',
      [qty, id, userId]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error en updateItem:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM carrito WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ítem del carrito no encontrado' });
    }

    return res.status(200).json({ message: 'Ítem eliminado del carrito' });
  } catch (err) {
    console.error('Error en removeItem:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await query('DELETE FROM carrito WHERE usuario_id = $1', [userId]);

    return res.status(200).json({ message: 'Carrito vaciado correctamente' });
  } catch (err) {
    console.error('Error en clearCart:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
