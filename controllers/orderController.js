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
}

module.exports = orderController = {
    getAllOrders
};