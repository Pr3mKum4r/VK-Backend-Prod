const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/razorpayRoute.js");
const {
  authenticateShiprocket,
  shiprocketAuthMiddleware,
} = require("./middlewares/shiprocketAuth.js");
const orderRoutes = require("./routes/orderRoute.js");
const userRoutes = require("./routes/userRoute.js");
const schedule = require("node-schedule");

const PORT = 5000;

const app = express();

schedule.scheduleJob("0 0 1 */10 * *", () => {
  authenticateShiprocket;
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/payments", paymentRoutes);
app.use("/api/v1/shiprocket", shiprocketAuthMiddleware);
app.use("/api/v1/shiprocket", orderRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
