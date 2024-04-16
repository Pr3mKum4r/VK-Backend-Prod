const axios = require('axios');

const getAllOrders = async (req, res) => {
    const shiprocketToken = req.headers['Authorization'];
    const headers = {
        'Authorization': shiprocketToken,
    };
    try {
        axios.get('https://apiv2.shiprocket.in/v1/external/orders', { headers }).then((response) => {
            return res.json(response.data);
        }).catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
};
//Use this API to create a return order
// Path: VK-Backend/controllers/orderController.js
const createReturnOrder = async (req, res) => {
    const shiprocketToken = req.headers['Authorization'];
    const headers = {
        'Authorization': shiprocketToken
        // 'Content-Type': 'application/json'
    };
    
// const orderItems = req.body.order_items;
const returnOrderData = req.body;

try {
    // console.log('Sending request to Shiprocket API...');
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/return', returnOrderData, { headers });
    // console.log('Received response from Shiprocket API:', response.data);
    return res.json(response.data);
} catch (error) {
    console.log("Error in creating return order");
    console.log(error.response.data);
    return res.status(500).json({ error: 'Failed to create return order' });
}
};


module.exports = orderController = {
    getAllOrders,
    createReturnOrder
};