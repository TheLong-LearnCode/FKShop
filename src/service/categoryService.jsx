import api from "../config/axios";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

//POST
export const createCategory = async(data) => {
  try {
    const response = await api[POST]("/categories", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//DELETE
export const deleteCategory = async (categoryID) => {
  try {
    const response = await api[DELETE](`/categories/${categoryID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//PUT
export const updateCategory = async (categoryID, categoryData) => {
  try {
    console.log(categoryData);
    
    const response = await api[PUT](`/categories/${categoryID}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//GET
export const getAllCategories = async () => {
  try {
    const response = await api[GET]("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryByProductID = async (productID) => {
  try {
    const response = await api[GET](`/categories/byProductID/${productID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by product ID:", error);
    throw error;
  }
};
