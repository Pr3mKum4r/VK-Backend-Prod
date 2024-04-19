const {Router} = require('express');
const razorpayController = require('../controllers/razorpayController.js');

const router = Router();

router.post("/orders", razorpayController.getOrderId);
router.post("/payment-callback", razorpayController.paymentCallback);
router.get("/payment-cancel", razorpayController.paymentCancel);

module.exports = router;
