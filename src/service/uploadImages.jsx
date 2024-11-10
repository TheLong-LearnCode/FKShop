import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../config/axios";
import { POST } from "../constants/httpMethod";

export const uploadAvater = async(accountID, formData) => {
  try {
    const response = await api[POST](`/accounts/avatar/${accountID}`, formData);
    return response.data.url; // Assuming the response returns the uploaded avatar URL
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

export const ImageUploader = ({ fileList, setFileList, uploading, setUploading }) => {
  const uploadImage = async (file) => {
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

  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file); // Call API to upload the image
      onSuccess(imageUrl); // Pass the image URL to success callback
      message.success(`${file.name} uploaded successfully.`);
    } catch (error) {
      console.error("Upload failed:", error);
      message.error(`${file.name} upload failed.`);
      onError(error); // Pass error to error callback
    }
    setUploading(false);
  };

  const uploadProps = {
    customRequest: handleUpload,
    onChange: ({ fileList }) => setFileList(fileList),
    onRemove: (file) =>
      setFileList(fileList.filter((item) => item.uid !== file.uid)),
  };

  return (
    <Upload {...uploadProps} fileList={fileList}>
      <Button icon={<UploadOutlined />} loading={uploading}>
        Upload Image
      </Button>
    </Upload>
  );
};
