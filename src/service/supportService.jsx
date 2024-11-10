import api from "../config/axios";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";

//------------------##-----------7 API--------------##-------------------

//------------------##-----------USER--------------##-------------------
// khách hàng yêu cầu hỗ trợ
//supportInfo: {accountID, labID, description}
export const createSupport = async (supportInfo) => {
  try {
    const response = await api[POST]("support/create", supportInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//------------------------------------------------------------------

//------------------##-----------ADMIN--------------##-------------------

// lấy ra tất cả các support
export const getAllSupport = async () => {
  try {
    const response = await api[GET]("support/all-supports");
    return response.data;
  } catch (error) {
    if(error.status === 403) {
      throw error.status;
    }
    throw error;
  }
};

// cập nhật ngày hỗ trợ
//supportInfo: {supportingID, date}
export const updateSupportDate = async (supportInfo) => {
  try {
    const response = await api[PUT]("support/support-date", supportInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// cập nhật trạng thái hỗ trợ
//supportInfo: {supportingID, status}
export const updateSupportStatus = async (supportInfo) => {
  try {
    console.log("SUPPORT INFO: ", supportInfo);
    
    const response = await api[PUT]("support/status", supportInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSupport = async (supportInfo) => {
  try {
    const response = await api[PUT]("support/update", supportInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};



//----------------------------FILTER--------------------------------
export const getSupportByAccountID = async (accountID) => {
  try {
    const response = await api[GET](`support/support-accountID/${accountID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSupportByStatus = async (status) => {
  try {
    const response = await api[GET](`support/support-status/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSupportByAccountIDAndStatus = async (accountID, status) => {
  try {
    const response = await api[GET](`support/supports/${accountID}/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Thêm hàm mới này vào cuối file
export const getSupportByAccountIDAndSupportingID = async (accountID, supportingID) => {
  try {
    const response = await api[GET](`support/support-accountID/${accountID}`);
    const allSupports = response.data;
    
    // Lọc ra support detail cụ thể dựa trên supportingID
    const filteredSupport = allSupports.data.labSupports.find(
      support => support.supporting.supportingID === supportingID
    );

    // Tạo đối tượng kết quả mới chỉ chứa support detail được chọn
    const result = {
      ...allSupports,
      data: {
        ...allSupports.data,
        labSupports: filteredSupport ? [filteredSupport] : []
      }
    };

    return result;
  } catch (error) {
    throw error;
  }
};

//------------------------------------------------------------------
