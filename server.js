const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 5000;

const paymentRoutes = require('./routes/razorpayRoute.js');
//const shiprocketAuthMiddleware = require('./middlewares/shiprocketAuth.js');
const orderRoutes = require('./routes/orderRoute.js');
const userRoutes = require('./routes/userRoute.js');
const { startTokenRefreshJob } = require('./utils/saveShiprocketToken.js');

startTokenRefreshJob();

app.use("/api/payments", paymentRoutes);
//app.use("/api/v1/shiprocket", shiprocketAuthMiddleware);
app.use("/api/v1/shiprocket", orderRoutes); 
app.use("/api/v1/user", userRoutes);

app.listen(PORT, ()=>{console.log(`Server started at port ${PORT}`)});