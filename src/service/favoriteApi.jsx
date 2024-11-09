import api from "../config/axios";
import { DELETE, GET, POST } from "../constants/httpMethod";

export const viewFavoriteList = async (accountID) => {
    try {
      const response = await api[GET](`http://localhost:8080/fkshop/wishlists/byAccountID/${accountID}`);
      return response.data.data; // Trả về toàn bộ object data
    } catch (error) {
      throw error;
    }
  };

  export const addToFavoriteList = async (accountID, productID) => {
    try {
      const response = await api[POST]('http://localhost:8080/fkshop/wishlists', {accountID, productID});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const removeFavoriteProduct = async (wishlistID) => {
    try {
      const response = await api[DELETE](`http://localhost:8080/fkshop/wishlists/${wishlistID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };