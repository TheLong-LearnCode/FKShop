import api from "../config/axios";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

export const deleteBlog = async (id) => {
  try {
    const response = await api[DELETE](`/blogs/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting blog:", err);
    throw err;
  }
};

export const updateBlog = async (id, data) => {
  try {
    const response = await api[PUT](`/blogs/${id}`, data);
    return response.data;
  } catch (err) {
    console.error("Error updating blog:", err);
    throw err;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await api[GET]("/blogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};
export const createBlog = async (formData) => {
  try {
    const response = await api[POST]("/blogs", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};
