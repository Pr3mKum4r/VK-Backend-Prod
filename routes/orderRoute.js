const {Router} = require('express');
const orderController = require('../controllers/orderController.js');

const router = Router();

router.get('/orders', orderController.getAllOrders);
router.put('/orders/:orderId', orderController.updateOrder);
router.delete('/orders/:orderId', orderController.cancelOrder);

module.exports = router;
