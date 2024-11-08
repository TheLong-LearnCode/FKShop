import api from "../config/axios";
import { GET, PUT, POST, DELETE } from "../constants/httpMethod";

export const getAllQuestions = async () => {
  try {
    const response = await api[GET]("questions");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuestionByID = async (questionID) => {
  try {
    const response = await api[GET](`questions/${questionID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResponse = async (id, questionInfo) => {
  try {
    const response = await api[PUT](`questions/${id}`, questionInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuestion = async (questionID) => {
  try {
    const response = await api[DELETE](`questions/${questionID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add more functions as needed for your question management
