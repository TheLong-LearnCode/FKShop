import api from "../config/axios";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";
      
      
export const createFeedback = async (feedbackInfo) => {
    try {
      const response = await api[POST]("feedbacks", feedbackInfo);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

export const getFeedbackByProductID = async (productID) => {
    try {
      const response = await api[GET](`feedbacks/byProductID/${productID}`);
       return response.data;
    } catch (error) {
      throw error;
    }
}

export const deleteFeedback = async (id) => {
  try {
    const response = await api[DELETE](`/feedbacks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateFeedback = async (id, data) => {
    try {
      const response = await api[PUT](`/feedbacks/${id}`, data);
      return response.data;
    } catch (error) {
      throw (error);
    }
  }


export const getAllFeedbacks = async () => {
  try {
    const response = await api[GET]("/feedbacks");
    return response.data;
  } catch (error) {
    throw error;
  }
}



