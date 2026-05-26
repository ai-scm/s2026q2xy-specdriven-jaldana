const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/carrito.controller');
const { auth } = require('../middleware/auth.middleware');

// Todas las rutas del carrito requieren autenticación
router.use(auth);

// GET /api/carrito
router.get('/', getCart);

// POST /api/carrito
router.post('/', addItem);

// PUT /api/carrito/:id
router.put('/:id', updateItem);

// DELETE /api/carrito/:id
router.delete('/:id', removeItem);

// DELETE /api/carrito (limpiar todo el carrito)
router.delete('/', clearCart);

module.exports = router;
