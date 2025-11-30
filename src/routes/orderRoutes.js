const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authenticate, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getUserOrders);
router.get('/user/:userId', authenticate, authMiddleware.isAdmin, orderController.getOrdersByUserId);

module.exports = router;
