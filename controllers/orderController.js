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

const createCustomOrder = async (req, res) => {
  const shiprocketToken = req.headers["Authorization"];
  const orderData = req.body;

  try {
    const data = await createShiprocketOrder(shiprocketToken, orderData);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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

module.exports = orderController = {
  getAllOrders,
  createCustomOrder,
  createReturnOrder,
  cancelOrder,
  updateOrder,
  createShiprocketOrder,
};
