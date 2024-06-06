const crypto = require("crypto");
const Razorpay = require("razorpay");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const orderController = require("./orderController");

const getOrderId = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID || "",
      key_secret: process.env.KEY_SECRET || "",
    });
    var options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "TXN" + Date.now(),
      notes: {
        key1: req.body.name,
        key2: req.body.email,
        key3: req.body.number,
        key4: req.body.address,
        key5: req.body.product,
        key6: req.body.profile_name,
      },
    };

    instance.orders.create(options, function (err, order) {
      if (order) {
        return res.json({ orderId: order.id });
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const paymentCallback = async (req, res) => {
  const successUrl = "http://localhost:3000/success";
  const { razorpay_signature, razorpay_payment_id, razorpay_order_id } =
    req.body;
  console.log(req.body);
  try {
    const string = `${razorpay_order_id}|${razorpay_payment_id}`;

    const generated_signature = crypto
      .createHmac("sha256", process.env.KEY_SECRET || "")
      .update(string)
      .digest("hex");

    if (generated_signature == razorpay_signature) {
      console.log("payment successfull");
      await prisma.order.update({
        where: {
          id: razorpay_order_id,
        },
        data: {
          isPaid: true,
        },
      });
      orderController.createCustomOrder(req, res);
      return res.redirect(successUrl);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const paymentCancel = async (req, res) => {
  const failureUrl = "http://localhost:3000/failure";
  try {
    return res.redirect(failureUrl);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = razorpayController = {
  getOrderId,
  paymentCallback,
  paymentCancel,
};
