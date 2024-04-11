const {Router} = require('express');
const orderController = require('../controllers/orderController.js');

const router = Router();

router.get('/orders', orderController.getAllOrders);

module.exports = router;
