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

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updatedData = req.body;
  const shiprocketToken = req.headers["Authorization"];

  if (!updatedData) {
    return res.status(400).json({ error: "updatedData is required" });
  }

  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    const response = await axios.put(
      `https://apiv2.shiprocket.in/v1/external/orders/${orderId}`,
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

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const shiprocketToken = req.headers["Authorization"];
  const headers = {
    Authorization: shiprocketToken,
  };
  try {
    const response = await axios.delete(
      `https://apiv2.shiprocket.in/v1/external/orders/${orderId}`,
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
  cancelOrder,
  updateOrder,
};
