import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FeedbackTable from "./FeedbackTable";
import FeedbackModal from "./FeedbackModal";
import {
  getAllFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../../service/feedbackService";
import "./index.css";
const { Search } = Input;

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchAllFeedbacks = async () => {
    const response = await getAllFeedbacks();
    console.log(response);

    const feedbackList = response.map((item) => ({
      ...item.feedback,
      customerName: item.customerName,
      productName: item.product.name,
    }));

    setFeedbacks(feedbackList);
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const showModal = (mode, feedback = null) => {
    setModalMode(mode);
    setSelectedFeedback(feedback);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedFeedback(null);
  };

  const handleModalOk = async (values) => {
    if (modalMode === "add") {
      // const response = await createFeedback(values);
      message.success(response.message);
    } else if (modalMode === "edit") {
      const updateFormData = {
        accountID: values.accountID,
        description: values.description,
        rate: values.rate,
      }
      
      const response = await updateFeedback(
        selectedFeedback.feedbackID,
        updateFormData
      );
      message.success(response.message);
    }
    fetchAllFeedbacks();
    setIsModalVisible(false);
  };

  const handleDelete = (feedback) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete feedback from customer ${feedback.customerName}?`,
      onOk: async () => {
        const response = await deleteFeedback(feedback.feedbackID);
        fetchAllFeedbacks();
        message.success(response.message);
      },
    });
  };

  return (
    <div className="container mt-4">
      <div className="row center mb-3">
        <div className="col-md-6">
          <Search
            placeholder="Search Feedback"
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="d-flex align-center mb-3">
        <h2>
          <strong>Feedback</strong>
        </h2>
        {/* <Button
          className="ml-auto"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal("add")}
        >
          Add Feedback
        </Button> */}
      </div>
      <FeedbackTable
        feedbacks={feedbacks}
        onView={(feedback) => showModal("view", feedback)}
        onEdit={(feedback) => showModal("edit", feedback)}
        onDelete={handleDelete}
      />
      <FeedbackModal
        visible={isModalVisible}
        mode={modalMode}
        feedback={selectedFeedback}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default FeedbackManager;
