const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorMiddleware.js');


const app = express();



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 5000;

const paymentRoutes = require('./routes/razorpayRoute.js');
const shiprocketAuthMiddleware = require('./middlewares/shiprocketAuth.js');
const orderRoutes = require('./routes/orderRoute.js');
const userRoutes = require('./routes/userRoute.js');
const { startTokenRefreshJob } = require('./utils/saveShiprocketToken.js');

startTokenRefreshJob();

app.use("/api/payments", paymentRoutes);
app.use("/api/v1/shiprocket", shiprocketAuthMiddleware);
app.use("/api/v1/shiprocket", orderRoutes); 
app.use("/api/v1/user", userRoutes);
// Example route handler to test error handling
app.get('/example', (req, res, next) => {
    try {
      // Some code that might throw an error
      throw new Error('Example error');
    } catch (error) {
      // Pass the error to Express error handler middleware
      next(error);
    }
  });

// Register the error handler middleware
app.use(errorHandler);


app.listen(PORT, ()=>{console.log(`Server started at port ${PORT}`)});