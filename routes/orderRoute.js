const {Router} = require('express');
const orderController = require('../controllers/orderController.js');

const router = Router();

router.get('/orders', orderController.getAllOrders);


router.post(`/orders`,orderController.createCustomOrder);
router.get('/trackorder/:orderID/:channelID',orderController.getTrackingDataWithOrderId);
router.get('/trackorder/:orderID',orderController.getTrackingDataWithOrderId);

module.exports = router;
