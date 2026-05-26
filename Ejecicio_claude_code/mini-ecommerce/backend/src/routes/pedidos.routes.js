const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder } = require('../controllers/pedidos.controller');
const { auth } = require('../middleware/auth.middleware');

// Todas las rutas de pedidos requieren autenticación
router.use(auth);

// GET /api/pedidos
router.get('/', getOrders);

// GET /api/pedidos/:id
router.get('/:id', getOrder);

// POST /api/pedidos
router.post('/', createOrder);

module.exports = router;
