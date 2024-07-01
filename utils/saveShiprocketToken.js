const axios = require('axios');
const schedule = require('node-schedule');
require('dotenv').config();
const db = require('../db');

let authToken = '';

const authenticateShiprocket = async () => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKETEMAIL,
            password: process.env.SHIPROCKETPASSWORD,
        });
        authToken = response.data.token;

        // Save the token to the database
        await db.shiprocketToken.create({
            data: {
                token: authToken,
            },
        });
        console.log('Shiprocket token refreshed successfully. token: ', authToken);
    } catch (error) {
        console.error('Failed to refresh Shiprocket token:', error);
    }
};

const startTokenRefreshJob = () => {
    // Run immediately on server start
    authenticateShiprocket();

    // Schedule to refresh token every 10 days
    schedule.scheduleJob('0 0 */10 * *', () => {
        authenticateShiprocket();
    });
};

module.exports = { startTokenRefreshJob };