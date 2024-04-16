const axios = require('axios');

const createReturnOrder = async (req, res) => {
    const shiprocketToken = req.headers['Authorization'];
    const headers = {
        'Authorization': shiprocketToken
        // 'Content-Type': 'application/json'
    };
    // "order_items": [
    //     {
    //       "sku": "WSH234",
    //       "name": "shoes",
    //       "units": 2,
    //       "selling_price": 100,
    //       "discount": 0,
    //       "qc_enable":true,
    //       "hsn": "123",
    //       "brand":"",
    //       "qc_size":"43"
    //        }
    //     ],
// Extract order items from the request body
// const orderItems = {
//     sku:req.body.order_items.sku,
//     name:req.body.order_items.name,
//     units:req.body.order_items.units,
//     selling_price:req.body.order_items.selling_price,
//     discount:req.body.order_items.discount || "",
//     qc_enable:req.body.order_items.qc_enable,
//     hsn:req.body.order_items.hsn || "",
//     brand:req.body.order_items.brand,
//     qc_size:req.body.order_items.qc_size
// }
const orderItems = req.body.order_items;

// Construct the return order data object
const returnOrderData = {
    order_id: req.body.order_id,
    order_date: req.body.order_date,
    channel_id: req.body.channel_id,
    pickup_customer_name: req.body.pickup_customer_name,
    pickup_last_name: req.body.pickup_last_name || "",
    company_name: req.body.company_name || "", // Include company_name from the request
    pickup_address: req.body.pickup_address,
    pickup_address_2: req.body.pickup_address_2 || "",
    pickup_city: req.body.pickup_city,
    pickup_state: req.body.pickup_state,
    pickup_country: req.body.pickup_country,
    pickup_pincode: req.body.pickup_pincode,
    pickup_email: req.body.pickup_email,
    pickup_phone: req.body.pickup_phone,
    pickup_isd_code: req.body.pickup_isd_code || "",
    pickup_location_id: req.body.pickup_location_id || "",
    shipping_customer_name: req.body.shipping_customer_name,
    shipping_last_name: req.body.shipping_last_name || "",
    shipping_address: req.body.shipping_address,
    shipping_address_2: req.body.shipping_address_2 || "",
    shipping_city: req.body.shipping_city,
    shipping_country: req.body.shipping_country,
    shipping_pincode: req.body.shipping_pincode,
    shipping_state: req.body.shipping_state,
    shipping_email: req.body.shipping_email || "",
    shipping_isd_code: req.body.shipping_isd_code || "",
    shipping_phone: req.body.shipping_phone,
    order_items: orderItems, // Use the extracted order items
    payment_method: req.body.payment_method,
    total_discount: req.body.total_discount || "",
    sub_total: req.body.sub_total,
    length: req.body.length,
    breadth: req.body.breadth,
    height: req.body.height,
    weight: req.body.weight
};


try {
    console.log('Sending request to Shiprocket API...');
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/return', returnOrderData, { headers });
    console.log('Received response from Shiprocket API:', response.data);
    return res.json(response.data);
} catch (error) {
    // const errors = response.data.errors;
    console.log("Error in creating return order");
    // console.log(errors);
    console.log(error.response.data);
    // console.error(error);
    return res.status(500).json({ error: 'Failed to create return order' });
}
};

module.exports = returnOrderController = {
    createReturnOrder
};
