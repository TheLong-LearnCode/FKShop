import api from "../config/axios";

import { GET, PUT, POST } from "../constants/httpMethod";

export const exportExcel = async (time) => {
  try {
    const response = await api[GET](`/orders/report/${time}`, {
      responseType: "blob", // Set response type to blob for file data
    });
    return response.data; // Return the file data directly
  } catch (error) {
    console.error(`Error in exportExcel for ${time}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api[PUT](
      `/orders/updatestatus/${id}?status=${status}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetailsByOrderID = async (id) => {
  try {
    const response = await api[GET](`/orders/details/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllOrders = async () => {
  try {
    const response = await api[GET]("/orders/allorders");
    // console.log("response::: ", response);
    return response.data;
  } catch (error) {
    console.log("Error: " + error);
  }
};
export const checkOutOrder = async (ordersRequest, orderDetailsRequest) => {
  try {
    console.log("Sending order request:", {
      ordersRequest,
      orderDetailsRequest,
    });
    const response = await api[POST]("/orders/checkout", {
      ordersRequest,
      orderDetailsRequest,
    });
    console.log("RESPONSE from checkOutOrder: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in checkOutOrder:", error);
    throw error;
  }
};

export const checkOutVNP = async (amount) => {
  try {
    const response = await api[POST](
      `/submitOrder?amount=${amount}&orderInfo=Payment for test`
    );
    console.log("RESPONSE: ", response.data);
    return response.data; // Đảm bảo rằng response.data chứa URL VNPAY
  } catch (error) {
    throw error;
  }
};

//view
export const getOrdersByAccountID = async (id) => {
  try {
    const response = await api[GET](`/orders/find/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error: " + error);

    throw error;
  }
};

//cancel
export const cancelOrder = async (id) => {
  try {
    const response = await api[PUT](`/orders/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error: " + error);
    throw error;
  }
};
