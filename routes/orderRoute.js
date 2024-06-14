const { Router } = require("express");
const orderController = require("../controllers/orderController.js");

const router = Router();

<<<<<<< HEAD
router.get("/orders", orderController.getAllOrders);
router.post("/orders/update", orderController.updateOrder);
router.post("/orders/cancel", orderController.cancelOrder);
=======
router.get('/orders', orderController.getAllOrders);


router.post(`/orders`,orderController.createCustomOrder);
router.get('/trackorder/:orderID/:channelID',orderController.getTrackingDataWithOrderId);
router.get('/trackorder/:orderID',orderController.getTrackingDataWithOrderId);
>>>>>>> origin/main

router.post(`/orders`, orderController.createCustomOrder);

router.post("/orders/create/return", orderController.createReturnOrder); //Create a return order
module.exports = router;
