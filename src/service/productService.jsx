import { Button, message, Upload } from "antd";
import api from "../config/axios";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export const addImages = async (productID, formData) => {
  try {
    const response = await api[PUT](
      `/product/add-images/${productID}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding images to product:", error);
    throw error;
  }
};

export const updateImage = async (productID, imageID, formData) => {
  try {
    const response = await api[PUT](
      `/product/image/${productID}/${imageID}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const updateProduct = async (productID, formData) => {
  try {
    const response = await api[PUT](`/product/${productID}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// -------------------------------GET------------------------------------
export const getActiveProduct = async () => {
  try {
    const response = await api[GET]("/product/aproducts");
    return response.data;
  } catch (error) {
    console.error("Error fetching active product:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await api[GET]("/product/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api[GET](`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductByType = async (productType) => {
  try {
    const response = await api[GET](`/product/type/${productType}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by type:", error);
    throw error;
  }
};

export const saleReport = async () => {
  try {
    const response = await api[GET]("/product/report/sales", {
      responseType: "blob", // Set response type to blob for file data
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};

// -------------------------------POST------------------------------------

export const addProduct = async (formData) => {
  try {
    const response = await api[POST]("/product/add", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const ProductUploadImage = ({
  mode,
  fileList,
  setFileList,
  uploading,
  setUploading,
  setDeletedImages,
  setUpdatedImages,
}) => {
  // const handleUpload = async (options) => {
  //   const { onSuccess, onError, file } = options;
  //   setUploading(true);
  //   try {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const base64 = e.target.result;
  //       onSuccess({ url: base64, originFileObj: file });
  //       message.success(`${file.name} uploaded successfully.`);
  //     };
  //     reader.readAsDataURL(file);
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     message.error(`${file.name} upload failed.`);
  //     onError(error);
  //   }
  //   setUploading(false);
  // };
  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        onSuccess({ url: base64, originFileObj: file });

        // Store updated images with their original UIDs
        if (mode === "edit") {
          setUpdatedImages((prev) => [...prev, { uid: file.uid, file }]);
          message.success(`${file.name} marked for update.`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      message.error(`${file.name} upload failed.`);
      onError(error);
    }

    setUploading(false);
  };

  const uploadProps = {
    customRequest: handleUpload,
    onPreview: (file) => {
      window.open(file.url); // Preview image in a new tab
    },
    beforeUpload: () => {
      false;
    },
    onChange: ({ fileList: newFileList }) => {
      if (typeof setFileList === "function") {
        setFileList(newFileList);
      } else {
        console.error("setFileList is not a function");
      }
    },
    onRemove: async (file) => {
      // Store the deleted image UID in the deletedImages array
      if (mode === "edit") {
        setDeletedImages((prev) => [...prev, file.uid]);
        message.success(`${file.name} marked for deletion.`);
      }
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    fileList,
    multiple: true,
    listType: "picture-card",
  };

  return (
    <Upload {...uploadProps} loading={uploading} disabled={mode === "view"}>
      <button style={{ border: 0, background: "none" }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    </Upload>
  );
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api[DELETE](`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const deleteImages = async (data) => {
  try {
    console.log("data: ", data);

    const response = await api[DELETE](`/product/images`, {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
