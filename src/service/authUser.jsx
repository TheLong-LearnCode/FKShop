import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios.jsx";
import { GET, POST, PUT } from "../constants/httpMethod.js";

import Cookies from "js-cookie";
import { message } from "antd";

/**
 *
 * @param {*} userdata
 * @returns
 */
export const login = createAsyncThunk("auth/login", async (user) => {
  try {
    const response = await api[POST]("/auth/login", user);
    console.log("response::");
    console.log(response);

    Cookies.set("token", response.data.data.token);
    return response.data;
  } catch (error) {
    return error;
  }
});

/**
 *
 * @param {*} userdata
 * @returns
 */
export const register = async (user) => {
  try {
    const response = await api[POST]("/auth/register", user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * Decode token / Giải mã token sau khi login
 * @param {*} token chuỗi token cần giải mã
 * @returns trả về thông tin chi tiết của user
 */
export const verifyToken = async (token) => {
  console.log("Token in verifyToken: ", token);

  try {
    const response = await api[GET]("/accounts/info", {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    console.log("response after verifyToken: ", response.data);
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.log("error: ", error);
    //message.error(error.response.data.message);
    return error; // Xử lý lỗi nếu có
  }
};

//do xử lý với Redux => dùng hàm CreateAsyncThunk()
/**
 * //lấy dữ liệu từ Cookie và cập nhật vào State/Redux
 */
export const loadUserFromCookie = createAsyncThunk(
  "auth/loadUserFromCookie",
  async (token) => {
    return await token;
  }
);

export const logoutService = (token) => {
  try {
  const response = api[POST]("auth/logout", token);
  return response.data;
  } catch(error){
    throw error;
  }
}
