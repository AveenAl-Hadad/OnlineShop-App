// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Produkte sehen (alle dürfen)
// GET alle Produkte
router.get('/', productController.getAllProducts);

// Nur Admins dürfen neue Produkte hinzufügen
// POST ein Produkt hinzufügen
router.post('/', productController.addProduct);

// Admins dürfen updaten
// PUT ein Produkt aktualisieren
router.put('/:id', productController.updateProduct);

// Admins dürfen löschen
// DELETE ein Produkt löschen
router.delete('/:id', productController.deleteProduct);

module.exports = router;
