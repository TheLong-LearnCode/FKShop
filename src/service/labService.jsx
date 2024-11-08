import api from "../config/axios";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";
import axios from 'axios';

//----------------------DELETE----------------------
export const deleteLab = async (id) => {
  try {
    //id này là id gì??
    const response = await api[DELETE](`/lab/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lab:", error);
    throw error;
  }
};
//----------------------DELETE----------------------

//-----------------------PUT-----------------------

export const updateLab = async (formData, labID) => {
  try {
    const response = await api[PUT](`/lab/${labID}`, 
      formData);
    return response.data;
  } catch (error) {
    console.error("Error updating lab:", error);
    throw error;
  }
};

//-----------------------PUT-----------------------

//-----------------------POST-----------------------

export const uploadLab = async (info, labID) => {
  try {
    const formData = new FormData();
    formData.append("pdf", info.file); // Đảm bảo file được thêm vào FormData
    const response = await api[POST](`/lab/upload-lab/${labID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading lab:", error);
    throw error;
  }
};

export const createLab = async (info) => {
  try {
    //productID, name, description, level, file(.pdf)
    const response = await api[POST]("/lab/addLab", info);
    return response.data;
  } catch (error) {
    console.error("Error creating lab:", error);
    throw error;
  }
};

export const downloadLab = async (info) => {
  try {
    //accountID, orderID, labID, productID
    const response = await api[POST]("/lab/download", info);
    return response.data;
  } catch (error) {
    console.error("Error downloading lab:", error);
    throw error;
  }
};

export const mergeLabGuide = async (labID, labGuideID) => {
  try {
    console.log("LAB GUIDE ID: ", labGuideID);
    
    const response = await api[POST](`/lab/pdf/create/${labID}`, JSON.stringify(labGuideID));
    return response.data;
  } catch (error) {
    console.error("Error merging lab guide:", error);
    throw error;
  }
};
//-----------------------POST-----------------------

//-----------------------GET-----------------------
export const getLabByStatus = async (status) => {
  try {
    const response = await api[GET](`/lab/status-labs/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab by status:", error);
    throw error;
  }
};
export const getLabByProductID = async (productID) => {
  try {
    const response = await api[GET](`/lab/product/${productID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab by productID:", error);
    throw error;
  }
};

export const getLabByAccountID = async (accountID) => {
  try {
    const response = await api[GET](`/lab/account/${accountID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab by accountID:", error);
    throw error;
  }
};

export const getAllLab = async () => {
  try {
    const response = await api[GET]("/lab/labs");
    return response.data;
  } catch (error) {
    console.error("Error fetching all labs:", error);
    throw error;
  }
};

export const getLabByLabID = async (labID) => {
  try {
    const response = await api[GET](`/lab/${labID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lab by labID:", error);
    throw error;
  }
};

//-----------------------GET-----------------------
