import React, { useState, useEffect } from "react";
import { Button, Form, message, Space, Modal, Select } from "antd";
import {
  getAllLab,
  createLab,
  updateLab,
  deleteLab,
  mergeLabGuide,
  getLabByStatus,
} from "../../../service/labService";
import { getAllProducts } from "../../../service/productService";
import LabTable from "./LabTable";
import LabModal from "./LabModal";
import { downloadMyLab } from "../../../service/userService";
import { getLabGuideByLabID } from "../../../service/labGuideService";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";

const LabManager = () => {
  const [labs, setLabs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLabId, setEditingLabId] = useState(null);
  const [products, setProducts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState(null);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [selectedLabID, setSelectedLabID] = useState(null);
  const [selectedLabGuideIDs, setSelectedLabGuideIDs] = useState([]);
  const [labGuideOptions, setLabGuideOptions] = useState([]);
  const [status, setStatus] = useState("all");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchLabs = async (status) => {
    let response;
    if (status === "all") {
      response = await getAllLab();
      setLabs(response);
      console.log("RESPONSE: ", response);
    } else {
      response = await getLabByStatus(status);
      setLabs(response.data);
    }
  };

  const fetchProducts = async () => {
    const response = await getAllProducts();
    // const response = await getActiveProduct();
    const productTypeKit = response.data.filter(
      (product) => product.type === "kit"
    );
    setProducts(productTypeKit);
  };
  useEffect(() => {
    fetchLabs(status);
    fetchProducts();
  }, [status]);

  const showModal = () => {
    setIsModalVisible(true);
    setEditingLabId(null);
    form.resetFields();
  };

  const showEditModal = (record) => {
    setIsModalVisible(true);
    setEditingLabId(record.labID);
    setCurrentFileName(record.fileNamePDF);
    form.setFieldsValue(record);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();

      //Nếu không có file mới, truyền null vào file

      // Duyệt qua các field trong form
      Object.keys(values).forEach((key) => {
        // Kiểm tra nếu có file mới, thì append file đó
        if (key === "file" && values[key]) {
          formData.append(key, values[key][0].originFileObj);
        } else if (key === "file" && !values[key]) {
          formData.delete(key);
          //formData.append(key, null);
        } else {
          formData.append(key, values[key]); // Append all fields regardless of file changes
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(key, typeof value);
      }

      try {
        if (editingLabId) {
          await updateLab(formData, editingLabId);
          message.success("Lab updated successfully");
        } else {
          await createLab(formData);
          message.success("Lab created successfully");
        }

        // Fetch updated labs list
        fetchLabs();

        // Reset the form fields, file state, and modal visibility
        form.resetFields(); // Reset all form fields
        setUploadedFile(null); // Clear uploaded file
        setCurrentFileName(null); // Clear current file name
        setIsModalVisible(false); // Close the modal
      } catch (error) {
        message.error("Operation failed: " + error.message);
      }
    });
  };

  const showViewModal = (record) => {
    setIsViewModalVisible(true);
    setEditingLabId(record.labID);
    setCurrentFileName(record.fileNamePDF);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
  };

  const handleDelete = async (labID) => {
    Modal.confirm({
      title: "Delete Lab",
      content: "Are you sure you want to delete this lab?",
      onOk: async () => {
        try {
          const response = await deleteLab(labID);
          message.success(response.message);
          fetchLabs();
        } catch (error) {
          message.error("Failed to delete lab");
        }
      },
    });
  };

  const handleDownloadPDF = async (fileName) => {
    console.log(`Downloading ${fileName}`);
    // Implement PDF download logic
  };

  const handleFileChange = (info) => {
    if (info.file.status === "removed") {
      setUploadedFile(null);
      message.success(`File removed successfully`);
    } else if (info.file.status === "done") {
      setUploadedFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      setUploadedFile(null);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const showMergeModal = () => {
    setIsMergeModalVisible(true);
    fetchLabs();
  };

  const handleLabIDChange = (value) => {
    setSelectedLabID(value);
    fetchLabGuidesForLab(value);
  };

  const fetchLabGuidesForLab = async (labID) => {
    try {
      const response = await getLabGuideByLabID(labID);
      setLabGuideOptions(response.data.labGuides);
    } catch (error) {
      message.error("Failed to fetch lab guides");
    }
  };

  const handleLabGuideSelect = (selectedIds) => {
    setSelectedLabGuideIDs(selectedIds);
  };

  const handleMerge = async () => {
    try {
      const labGuideIdsString = selectedLabGuideIDs.join(",");
      const response = await mergeLabGuide(selectedLabID, labGuideIdsString);
      console.log("RESPONSE: ", response);

      message.success("Lab guides merged successfully");
      setIsMergeModalVisible(false);
      setSelectedLabID(null);
      setSelectedLabGuideIDs([]);
      setLabGuideOptions([]);
      fetchLabs();
    } catch (error) {
      message.error("Failed to merge lab guides");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Space style={{ display: "flex", justifyContent: "flex-end" }}>
        <Select
          defaultValue={1} // Default to showing active labs
          onChange={handleStatusChange}
          style={{
            width: 200,
            marginBottom: "20px",
            justifySelf: "flex-start",
          }}
        >
          <Select.Option value="all">All Labs</Select.Option>
          <Select.Option value={1}>Active Labs</Select.Option>
          <Select.Option value={0}>Deleted Labs</Select.Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{ marginBottom: "20px" }}
        >
          Add New Lab
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showMergeModal}
          style={{ marginBottom: "20px" }}
        >
          Merge Lab Guide
        </Button>
      </Space>
      <LabTable
        labs={labs}
        onView={showViewModal}
        onEdit={showEditModal}
        onDelete={handleDelete}
        onDownloadPDF={handleDownloadPDF}
        onFileChange={handleFileChange}
      />
      <LabModal
        mode={isViewModalVisible ? "view" : editingLabId ? "edit" : "add"}
        visible={isModalVisible || isViewModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        form={form}
        products={products}
        onFileChange={handleFileChange}
        editingLabId={editingLabId}
        currentFileName={currentFileName}
        uploadedFile={uploadedFile}
      />
      <Modal
        title="Merge Lab Guide"
        visible={isMergeModalVisible}
        onOk={handleMerge}
        onCancel={() => setIsMergeModalVisible(false)}
      >
        <Form>
          <Form.Item label="Select Lab ID">
            <Select onChange={handleLabIDChange} placeholder="Select a lab">
              {labs.map((lab) => (
                <Select.Option key={lab.labID} value={lab.labID}>
                  {lab.labID} - {lab.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Lab Guides">
            <Select
              mode="multiple"
              placeholder="Select lab guides to merge"
              onChange={handleLabGuideSelect}
              disabled={!selectedLabID}
            >
              {labGuideOptions.map((guide) => (
                <Select.Option key={guide.labGuideID} value={guide.labGuideID}>
                  {guide.labGuideID} - {guide.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LabManager;
