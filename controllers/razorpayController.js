const crypto = require('crypto');
const Razorpay = require('razorpay');
const getTotalPrice = require('../utils/getTotalPrice');
const db = require('../db');

const getOrderId = async (req, res) => {
    try {
        // Get the total amount from the database of products
        const amount = await getTotalPrice(req.body.productIds);
        console.log("amount: ", amount)

        console.log('req.body.amount =', req.body.amount);
        var instance = new Razorpay({ key_id: process.env.KEY_ID || "", key_secret: process.env.KEY_SECRET || "" })
        var options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "TXN" + Date.now(),
            notes: {
                key1: req.body.name,
                key2: req.body.email,
                key3: req.body.number,
                key4: req.body.address,
                key5: req.body.product,
                key6: req.body.profile_name,
            }
        };

        instance.orders.create(options, function (err, order) {
            if (order) {
                console.log("orderId: ", order.id);
                return res.json({"orderId": order.id, "amount": amount});
            } else {
                console.log(err);
            }
        });

        console.log('getOrderId completed');
    } catch (error) {
        console.log(error.message);
    }
};

const paymentCallback = async (req, res) => {
    const successUrl = 'http://localhost:3001/success';
    const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = req.body
    console.log('paymentCallback called');
    console.log(req.body)
    try {
        const string = `${razorpay_order_id}|${razorpay_payment_id}`;

        const generated_signature = crypto
            .createHmac('sha256', process.env.KEY_SECRET || "")
            .update(string)
            .digest('hex');

        if (generated_signature == razorpay_signature) {
            console.log('payment successfull')
            // Fetch order from DB using razorpay_order_id and update paid status
            try {
                // Check if the order exists
                const existingOrder = await db.userOrder.findUnique({
                  where: { orderId: razorpay_order_id },
                });
            
                if (!existingOrder) {
                  console.log(`Order with orderId ${razorpay_order_id} not found.`);
                  return;
                }
            
                // Update the order if it exists
                const updatedOrder = await db.userOrder.update({
                  where: { orderId: razorpay_order_id },
                  data: { isPaid: true },
                });
                console.log('Order updated:', updatedOrder);
              } catch (error) {
                console.error('Error updating order:', error);
              }
            
              
            // Call the shiprocket order creation api

            return res.redirect(successUrl);
        }
    } catch (error) {
        console.log(error.message);
    }
}

const paymentCancel = async (req, res) => {
    const failureUrl = 'http://localhost:3001/failure';
    try {
        return res.redirect(failureUrl);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = razorpayController = {
    getOrderId,
    paymentCallback,
    paymentCancel
};
