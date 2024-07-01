const crypto = require('crypto');
const Razorpay = require('razorpay');
const getTotalPrice = require('../utils/getTotalPrice');
const db = require('../db');
const { getLatestToken } = require('../utils/getShiprocketToken');
const { Random } = require("random-js");
const { createCustomOrder } = require('../utils/createOrder');

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
                return res.json({ "orderId": order.id, "amount": amount });
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
            // Check if the order exists
            const existingOrder = await db.userOrder.findUnique({
                where: { orderId: razorpay_order_id },
                include: {
                    userData: true,
                    products: true,
                },
            });
            console.log("exisiting Order: ", existingOrder);

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


            // Call the shiprocket order creation api
            const shiprocketToken = await getLatestToken();

            // Data to be passed
            // {
            //     "order_id": "244-397",
            //     "order_date": "2024-05-24 11:11",
            //     "pickup_location": "Primary",
            //     "billing_customer_name": "Naruto",
            //     "billing_last_name": "Uzumaki",
            //     "billing_address": "House 221B, Leaf Village",
            //     "billing_address_2": "Near Hokage House",
            //     "billing_city": "New Delhi",
            //     "billing_pincode": "110002",
            //     "billing_state": "Delhi",
            //     "billing_country": "India",
            //     "billing_email": "naruto@uzumaki.com",
            //     "billing_phone": "9876543210",
            //     "shipping_is_billing": true,
            //     "order_items": [
            //       {
            //         "name": "Kunai",
            //         "sku": "chakra123",
            //         "units": 10,
            //         "selling_price": 900,
            //         "hsn": 441122
            //       }
            //     ],
            //     "payment_method": "Prepaid",
            //     "sub_total": 9000,
            //     "length": 10,
            //     "breadth": 15,
            //     "height": 20,
            //     "weight": 2.5
            //   }

            const random = new Random();
            const randVal = random.integer(100000, 999999);

            const orderData = {
                order_id: randVal,
                order_date: existingOrder.createdAt.toISOString(),
                pickup_location: "Primary",
                billing_customer_name: existingOrder.userData.firstName,
                billing_last_name: existingOrder.userData.lastName,
                billing_address: existingOrder.userData.address1,
                billing_address_2: existingOrder.userData.address2 || "",
                billing_city: existingOrder.userData.city,
                billing_pincode: existingOrder.userData.pin,
                billing_state: existingOrder.userData.state,
                billing_country: existingOrder.userData.country,
                billing_email: existingOrder.userData.email,
                billing_phone: existingOrder.userData.phone,
                shipping_is_billing: true,
                order_items: existingOrder.products.map(product => ({
                    name: product.productId, // Adjust based on actual field or relationship
                    sku: product.productId,
                    units: 1, // Adjust as needed
                    selling_price: existingOrder.price, // Adjust based on actual field or calculation
                })),
                payment_method: "Prepaid",
                sub_total: existingOrder.price,
                length: 10,
                breadth: 15,
                height: 20,
                weight: 2.5
            };

            const shiprocketOrder = await createCustomOrder(shiprocketToken, orderData);
            console.log("shiprocket order created", shiprocketOrder);

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
