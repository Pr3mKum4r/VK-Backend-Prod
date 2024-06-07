const crypto = require('crypto');
const Razorpay = require('razorpay');
const getTotalPrice = require('../utils/getTotalPrice');

const getOrderId = async (req, res) => {
    try {
        // Get the total amount from the database of products
        const amount = await getTotalPrice(req.body.productIds);

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
            //create a new order in database
            
            // const newOrder = await prisma.order.create({
            //     data: {
            //         id: razorpay_order_id,
            //         storeId: req.body.storeId,
            //         store: req.body.store,
            //         orderItems: req.body.orderItems,
            //         isPaid: true,
            //         phone: req.body.phone,
            //         address: req.body.address,
            //         email: req.body.email
            //     },
            // });
            // return res.redirect(successUrl);
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
