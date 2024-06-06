const axios = require("axios");
const schedule = require("node-schedule");
require("dotenv").config();

let authToken = "";

const authenticateShiprocket = async () => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKETEMAIL,
        password: process.env.SHIPROCKETPASSWORD,
      },
    );
    authToken = response.data.token;
    console.log("Shiprocket token refreshed successfully. token: ", authToken);
  } catch (error) {
    console.error("Failed to refresh Shiprocket token:", error);
  }
};

// Schedule to refresh token every 10 days
schedule.scheduleJob("0 0 */10 * *", () => {
  authenticateShiprocket();
});

authenticateShiprocket();

const shiprocketAuthMiddleware = (req, res, next) => {
  if (!authToken) {
    return res.status(503).json({
      error: "Authentication token is not available. Please try again later.",
    });
  }

  req.headers["Authorization"] = `Bearer ${authToken}`;
  next();
};

module.exports = shiprocketAuthMiddleware;
