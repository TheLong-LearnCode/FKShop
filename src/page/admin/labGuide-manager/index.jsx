import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Radio,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getAllLab } from "../../../service/labService";
import {
  createLabGuide,
  deleteLabGuide,
  getAllLabGuide,
  getLabGuideByLabGuideID,
  getLabGuideByLabID,
  updateLabGuide,
  uploadImage,
} from "../../../service/labGuideService";
import LabGuideModal from './Modal';

const { Option } = Select;

const LabGuideManager = () => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const [labGuides, setLabGuides] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLabID, setSelectedLabID] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGuideId, setEditingGuideId] = useState(null);
  const [content, setContent] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    fetchLabs();
    fetchLabGuides();
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);


  const fetchAllLabGuides = async () => {
    const response = await getAllLabGuide();
    setLabGuides(response.data);
  };

  const fetchLabGuides = async (labID) => {
    if (!labID || labID === "all") {
      fetchAllLabGuides(); // fetch all lab guides if "All" is selected
      return;
    }
    // API call to fetch lab guides by labID
    const response = await getLabGuideByLabID(labID);
    console.log("RESPONSE", response);
    setLabGuides(response.data.labGuides);
    setSelectedLabID(labID);
  };

  const fetchLabs = async () => {
    // API call to fetch labs
    const response = await getAllLab();
    setLabs(response);
  };

  const columns = [
    { title: "Lab Guide ID", dataIndex: "labGuideID", key: "labGuideID" },
    // { title: "Lab ID", dataIndex: "selectedLabID", key: "selectedLabID" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Step", dataIndex: "step", key: "step" },
    {
      title: "Integrated",
      dataIndex: "isUsed",
      key: "isUsed",
      render: (isUsed) => (isUsed === 1 ? "Yes" : "No"),
    },
    // { title: "Content", dataIndex: "content", key: "content", render: (content) => content.slice(0, 50) + '...' },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              selectedLabID === "all"
                ? message.error("Please select a labID")
                : handleView(record.labGuideID)
            }
          >
            {/* View */}
          </Button>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            {/* Edit */}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Are you sure you want to delete this lab guide?",
                content: "This action cannot be undone.",
                onOk() {
                  handleDelete(record.labGuideID);
                },
              })
            }
            danger
          >
            {/* Delete */}
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
    setEditingGuideId(null);
    form.resetFields();
    setContent("");
  };

  const showEditModal = async (record) => {
    setIsModalVisible(true);
    setEditingGuideId(record.labGuideID);

    let selectedLab = selectedLabID;

    if (!selectedLabID || selectedLabID === "all") {
      // Find the correct labID corresponding to the labGuideID
      selectedLab = labs.find((lab) =>
        lab.labGuides.some((guide) => guide.labGuideID === record.labGuideID)
      )?.labID;

      if (selectedLab) {
        setSelectedLabID(selectedLab);
      }
    }

    // Set form values after fetching the correct labID and record details
    form.setFieldsValue({
      labID: selectedLab,
      description: record.description,
      content: record.content,
      isUsed: record.isUsed,
    });

    setContent(record.content || "");
  };

  //khi thay đổi labID ở dropdown thì fetchLabGuides
  const handleLabChange = (value) => {
    console.log("VALUE", value);
    setSelectedLabID(value);
    if (value === "all") {
      fetchAllLabGuides();
    } else {
      fetchLabGuides(value);
    }
  };

  const handleView = async (labGuideID) => {
    try {
      const response = await getLabGuideByLabGuideID(labGuideID);
      setIsModalVisible(true);
      setIsViewMode(true); // Bật chế độ chỉ xem
      const labGuide = response.data;

      // Tìm lab tương ứng với labGuideID
      const selectedLab = labs.find((lab) =>
        lab.labGuides.some((guide) => guide.labGuideID === labGuideID)
      );

      // Đặt labID và description cho form
      form.setFieldsValue({
        labID: selectedLab ? selectedLab.labID : null, // Đặt giá trị labID vào form
        description: labGuide.description,
        isUsed: labGuide.isUsed,
      });

      setContent(labGuide.content); // Đặt giá trị content
    } catch (error) {
      message.error("Failed to fetch lab guide details");
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const data = { ...values, content };
      if (editingGuideId) {
        // API call to update lab guide
        console.log("content: ", data.content);
        try {
          const response = await updateLabGuide(editingGuideId, data);
          message.success(response.message);
          fetchLabGuides(selectedLabID);
        } catch (error) {
          message.error(error.response.data.message);
        }
      } else {
        try {
          console.log("content: ", data.content);
          
          const response = await createLabGuide(data);
          message.success(response.message);
          fetchLabGuides(selectedLabID);
        } catch (error) {
          message.error("Failed to create lab guide");
        }
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewMode(false); // Tắt chế độ xem khi đóng Modal
  };

  const handleDelete = async (labGuideID) => {
    try {
      // API call to delete lab guide
      console.log("LAB GUIDE ID", labGuideID);
      const response = await deleteLabGuide(labGuideID);
      message.success(response.message);
      fetchLabGuides(selectedLabID);
    } catch (error) {
      console.log("ERROR", error);
      message.error("Failed to delete lab guide");
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            try {
              const imageUrl = await uploadImage(file);
              resolve({ default: imageUrl }); // Use the uploaded image URL
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    //-------------------------------Main Page-----------------------------------
    <div style={{ padding: "20px" }}>
      <h1>Lab Guide Manager</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          verticalAlign: "middle",
        }}
      >
        <div style={{ flex: "1", marginRight: "40%" }}>
          <Form.Item name="labID" label="Lab ID" rules={[{ required: true }]}>
            <Select onChange={handleLabChange}>
              <Option value="all">All</Option>
              {labs.map((lab) => (
                <Option key={lab.labID} value={lab.labID}>
                  {lab.labID} - {lab.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div style={{ flex: "0" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            style={{ marginBottom: "10px" }}
          >
            Add New Lab Guide
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={labGuides}
        rowKey="labGuideID"
        style={{ textAlign: "center" }}
        pagination={{ pageSize: 5 }}
      />
      <LabGuideModal
        isModalVisible={isModalVisible}
        isViewMode={isViewMode}
        editingGuideId={editingGuideId}
        form={form}
        labs={labs}
        isLayoutReady={isLayoutReady}
        content={content}
        setContent={setContent}
        handleOk={handleOk}
        handleCancel={handleCancel}
        uploadPlugin={uploadPlugin}
      />
    </div>
  );
};

export default LabGuideManager;
