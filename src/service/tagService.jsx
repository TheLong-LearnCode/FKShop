import api from "../config/axios";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

export const getTagbyId = async (id) => {
  try {
    const response = await api[GET](`/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    throw error;
  }
};

export const getAllTags = async () => {
  try {
    const response = await api[GET]("/tags");
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

export const createTag = async (data) => {
  try {
    const response = await api[POST]("/tags", data);
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

export const deleteTag = async (tagID) => {
  try {
    const response = await api[DELETE](`/tags/${tagID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};

export const updateTag = async (tagID, data) => {
  try {
    const response = await api[PUT](`/tags/${tagID}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw error;
  }
};
