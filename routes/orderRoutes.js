const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/addOrder', orderController.createOrder);
router.get('/getOrder', orderController.getOrders);
router.put('/updateOrder/:id', orderController.updateOrderStatus);
router.delete('/deleteOrder/:id', orderController.deleteOrder);
router.get('/fetchOrder/:id',orderController.fetchOrder)
router.put('/updateOrderProduct/:id',orderController.updateOrderProduct)

module.exports = router;
