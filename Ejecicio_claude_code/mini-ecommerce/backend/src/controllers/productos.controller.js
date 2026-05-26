const { query } = require('../config/db');

const getAll = async (req, res) => {
  try {
    const { categoria } = req.query;
    let sql = 'SELECT id, nombre, descripcion, precio, stock, imagen_url, categoria, created_at FROM productos';
    const params = [];

    if (categoria) {
      sql += ' WHERE categoria = $1';
      params.push(categoria);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error en getAll productos:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, nombre, descripcion, precio, stock, imagen_url, categoria, created_at FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error en getById producto:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;

    if (!nombre || precio === undefined || precio === null) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    if (isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    const result = await query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, descripcion || null, parseFloat(precio), parseInt(stock) || 0, imagen_url || null, categoria || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error en create producto:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;

    const existing = await query('SELECT id FROM productos WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const result = await query(
      `UPDATE productos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        precio = COALESCE($3, precio),
        stock = COALESCE($4, stock),
        imagen_url = COALESCE($5, imagen_url),
        categoria = COALESCE($6, categoria)
      WHERE id = $7
      RETURNING *`,
      [
        nombre || null,
        descripcion || null,
        precio !== undefined ? parseFloat(precio) : null,
        stock !== undefined ? parseInt(stock) : null,
        imagen_url || null,
        categoria || null,
        id,
      ]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error en update producto:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error en remove producto:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };
