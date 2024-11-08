import api from "../config/axios";
import { GET, POST, DELETE, PUT } from "../constants/httpMethod";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api[POST](`/lab/upload-img`, formData);
    return response.data.url; // Assuming the response returns the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const updateLabGuide = async (id, info) => {
  try{
    //info gồm: labID, stepDescription, image
    const response = await api[PUT](`/lab-guide/info/${id}`, info);
    return response.data;
  } catch (error) {
    console.error("Error updating lab guide:", error);
    throw error;
  }
}

export const deleteLabGuide = async (id) => {
  try{
    const response = await api[DELETE](`/lab-guide/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lab guide:", error);
    throw error;
  }
}   

export const createLabGuide = async (info) => {
  try{
    //info gồm: labID, stepDescription, image
    const response = await api[POST](`/lab-guide/create`, info);
    return response.data;
  } catch (error) {
    console.error("Error creating lab guide:", error);
    throw error;
  }
}

//----------------------GET----------------------
export const getAllLabGuide = async () => {
  try{
    const response = await api[GET](`/lab-guide/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab guide:", error);
    throw error;
  }
}

export const getLabGuideByLabGuideID = async (id) => {
  try{
    const response = await api[GET](`/lab-guide/guide/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab guide:", error);
    throw error;
  }
}

export const getLabGuideByLabID = async (labID) => {
    try{
      const response = await api[GET](`/lab-guide/guide-by-labID/${labID}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching lab guide:", error);
      throw error;
    }
  }
//----------------------GET----------------------
