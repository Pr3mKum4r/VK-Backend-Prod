const axios = require("axios");

const getAllOrders = async (req, res) => {
  const shiprocketToken = req.headers["Authorization"];
  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    axios
      .get("https://apiv2.shiprocket.in/v1/external/orders", { headers })
      .then((response) => {
        return res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

//Use this API to create a return order
// Path: VK-Backend/controllers/orderController.js
const createReturnOrder = async (req, res) => {
  const shiprocketToken = req.headers["Authorization"];
  const headers = {
    Authorization: shiprocketToken,
    // 'Content-Type': 'application/json'
  };

  // const orderItems = req.body.order_items;
  const returnOrderData = req.body;

  try {
    // console.log('Sending request to Shiprocket API...');
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/return",
      returnOrderData,
      { headers },
    );
    // console.log('Received response from Shiprocket API:', response.data);
    return res.json(response.data);
  } catch (error) {
    console.log("Error in creating return order");
    console.log(error.response.data);
    return res.status(500).json({ error: "Failed to create return order" });
  }
};

//Use this API to create a quick custom order.
//https://apidocs.shiprocket.in/#247e58f3-37f3-4dfb-a4bb-b8f6ab6d41ec
// const createCustomOrder = async (req, res) => {
//   const shiprocketToken = req.headers["Authorization"];
//   //details about order will be sent from frontend as orderData
//   let orderData = req.body;
//   const headers = {
//     Authorization: shiprocketToken,
//   };
//   try {
//     axios
//       .post(
//         `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,
//         orderData,
//         { headers },
//       )
//       .then((data) => {
//         return res.json(data.data);
//         //Save 'data.data.order ID' as we will use this in future API calls.
//       })
//       .catch((error) => {
//         console.log(error);
//         return res.json(error);
//         //error has message and status code
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

//Use this API to
//create a quick custom order.
//https://apidocs.shiprocket.in/#247e58f3-37f3-4dfb-a4bb-b8f6ab6d41ec

// {
//     "order_id": "224-387",
//     "order_date": "2024-05-24 11:11",
//     "pickup_location": "Primary",
//     "billing_customer_name": "Naruto",
//     "billing_last_name": "Uzumaki",
//     "billing_address": "House 221B, Leaf Village",
//     "billing_address_2": "Near Hokage House",
//     "billing_city": "New Delhi",
//     "billing_pincode": "110002",
//     "billing_state": "Delhi",
//     "billing_country": "India",
//     "billing_email": "naruto@uzumaki.com",
//     "billing_phone": "9876543210",
//     "shipping_is_billing": true,
//     "order_items": [
//       {
//         "name": "Kunai",
//         "sku": "chakra123",
//         "units": 10,
//         "selling_price": 900,
//         "hsn": 441122
//       }
//     ],
//     "payment_method": "Prepaid",
//     "sub_total": 9000,
//     "length": 10,
//     "breadth": 15,
//     "height": 20,
//     "weight": 2.5
//   }

const createCustomOrder = async (req, res) => {
  const shiprocketToken = req.headers["Authorization"];
  //details about order will be sent from frontend as orderData
  let orderData = req.body;
  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    axios
      .post(
        `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,
        orderData,
        { headers },
      )
      .then((data) => {
        return res.json(data.data);
        //Save 'data.data.order ID' as we will use this in future API calls.
      })
      .catch((error) => {
        console.log(error);
        return res.json(error);
        //error has message and status code
      });
  } catch (error) {
    console.log(error);
  }
};

const createShiprocketOrder = async (shiprocketToken, orderData) => {
  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderData,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
};

//orders/update
const updateOrder = async (req, res) => {
  const updatedData = req.body;
  const shiprocketToken = req.headers["Authorization"];

  if (!updatedData) {
    return res.status(400).json({ error: "updatedData is required" });
  }

  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    const response = await axios.post(
      `https://apiv2.shiprocket.in/v1/external/orders/update/adhoc`,
      updatedData,
      { headers },
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error updating order:", error.message);
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    } else {
      return res.status(500).json({ error: "Failed to update order" });
    }
  }
};

//orders/cancel
const cancelOrder = async (req, res) => {
  const ids = req.body; //ids is an array of order ids
  const shiprocketToken = req.headers["Authorization"];
  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    const response = await axios.post(
      `https://apiv2.shiprocket.in/v1/external/orders/${orderId}`,
      ids,
      { headers },
    );
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to cancel order" });
  }
};

//Use this API to
//Get Tracking data through orderID
//https://apidocs.shiprocket.in/#bfcf3357-4e39-4134-831a-1ff33f67205e
const getTrackingDataWithOrderId = async (req, res) => {
  const shiprocketToken = req.headers["Authorization"];
  //orderID is required and channelID is optional. Will be sent from frontend as URLParameters
  let { orderID, channelID } = req.params;

  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    if (channelID === undefined) {
      axios
        .get(
          `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderID}`,
          { headers },
        )
        .then((data) => {
          return res.json(data.data);
          //Tracking Data will be sent as response
        })
        .catch((error) => {
          console.log(error);
          return res.json(error);
          //error has message and status code
        });
    } else {
      axios
        .get(
          `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderID}&channel_id=${channelID}`,
          { headers },
        )
        .then((data) => {
          return res.json(data.data);
          //Tracking Data will be sent as response
        })
        .catch((error) => {
          console.log(error);
          return res.json(error);
          //error has message and status code
        });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = orderController = {
  getAllOrders,
  createCustomOrder,
  createReturnOrder,
  cancelOrder,
  updateOrder,
  createShiprocketOrder,
  getTrackingDataWithOrderId,
};
