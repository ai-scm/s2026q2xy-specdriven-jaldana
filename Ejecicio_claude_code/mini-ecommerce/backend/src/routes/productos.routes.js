const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productos.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// GET /api/productos - público
router.get('/', getAll);

// GET /api/productos/:id - público
router.get('/:id', getById);

// POST /api/productos - solo admin
router.post('/', auth, isAdmin, create);

// PUT /api/productos/:id - solo admin
router.put('/:id', auth, isAdmin, update);

// DELETE /api/productos/:id - solo admin
router.delete('/:id', auth, isAdmin, remove);

module.exports = router;
