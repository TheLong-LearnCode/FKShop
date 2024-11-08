import api from "../config/axios";
import { GET, PUT, POST, DELETE } from "../constants/httpMethod";

// Hiển thị giỏ hàng
export const viewCart = async (accountID) => {
  try {
    const response = await api[GET](`/carts/view/${accountID}`);
    return response.data.data; // Trả về toàn bộ object data
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (accountID, productID, quantity) => {
  try {
    const response = await api[POST]('/carts/create', { accountID, productID, quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (accountID, productID, quantity) => {
  try {
    const response = await api[PUT]("/carts", { accountID, productID, quantity });
    return response.data.data;
  } catch (error) {
    console.log("Error updating cart item:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (accountID, productID) => {
  try {
    const response = await api[DELETE](`/carts/delete?accountID=${accountID}&productID=${productID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

