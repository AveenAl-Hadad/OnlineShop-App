const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
//const { verifyToken } = require('../middleware/authMiddleware');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
//Option 2 – Wenn du wirklich eine Route für „alle Bestellungen“ brauchst:
router.get('/all',verifyToken, isAdmin, orderController.getAllOrders); // für Admin z. B.

router.post('/', verifyToken, orderController.createOrder);
router.get('/user', verifyToken, orderController.getOrdersByUser);

module.exports = router;
