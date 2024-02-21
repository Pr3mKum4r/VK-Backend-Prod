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
app.use("/api/payments", paymentRoutes);

app.listen(PORT, ()=>{console.log(`Server started at port ${PORT}`)});