// ProfileInformation.js
import React, { useEffect, useState, useCallback } from "react";
import { message, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import {
  getOrdersByAccountID,
  getOrderDetailsByOrderID,
} from "../../../service/orderService";
import { getProductById } from "../../../service/productService";
import { createFeedback } from "../../../service/feedbackService";
import { getLabByAccountID } from "../../../service/labService";
import OrderTabs from "./OrderTabs";
import OrderList from "./OrderList";
import OrderDetails from "./OrderDetails";
import FeedbackDetail from "./FeedbackDetail";
import SupportModal from "./SupportModal";

export default function Purchase({ userInfo }) {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    processing: 0,
    delivering: 0,
    delivered: 0,
    cancel: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeedBackModal, setisFeedBackModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchOrders = useCallback(async () => {
    if (userInfo?.accountID) {
      const response = await getOrdersByAccountID(userInfo.accountID);
      setAllOrders(response.data);
      setFilteredOrders(response.data);

      const counts = {
        all: response.data.length,
        pending: 0,
        processing: 0,
        delivering: 0,
        delivered: 0,
        cancel: 0,
      };

      response.data.forEach((order) => {
        const status = order.orders.status.toLowerCase();
        if (counts.hasOwnProperty(status)) {
          counts[status]++;
        }
        if (status === "in-progress") {
          counts.processing++;
        }
      });

      setTabCounts(counts);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (id) {
      const orderId = id.split("=")[1];
      showOrderDetails(orderId);
      showFeedbackDetails(orderId);
    }
  }, [id]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "all") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (order) => order.orders.status.toLowerCase() === key
      );
      setFilteredOrders(filtered);
    }
  };

  const showFeedbackDetails = async (orderId) => {
    const details = await getOrderDetailsByOrderID(orderId);
    const detailsWithImages = await Promise.all(
      details.data.map(async (detail) => {
        const product = await getProductById(detail.productID);
        return {
          ...detail,
          image: product.data.images[0]?.url,
          productName: product.data.name,
        };
      })
    );
    setOrderDetails(detailsWithImages);
    setisFeedBackModal(true);
  };

  const showOrderDetails = useCallback(
    async (orderId) => {
      const details = await getOrderDetailsByOrderID(orderId);
      const detailsWithImages = await Promise.all(
        details.data.map(async (detail) => {
          const product = await getProductById(detail.productID);
          return {
            ...detail,
            image: product.data.images[0]?.url,
            productName: product.data.name,
            productType: product.data.type
          };
        })
      );
      setOrderDetails(detailsWithImages);
      setSelectedOrder(
        allOrders.find((order) => order.orders.ordersID === orderId)
      );
      setIsModalVisible(true);
    },
    [allOrders, navigate]
  );

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setOrderDetails([]);
    navigate("/user/purchase", { replace: true });
  };

  const handleFeedbackCancel = () => {
    setisFeedBackModal(false);
    setSelectedProductID(null);
    setModalContent("");
    setRating(0);
  };

  const handleFeedbackOk = async () => {
    try {
      await createFeedback({
        accountID: userInfo.accountID,
        productID: selectedProductID,
        description: modalContent,
        rate: rating,
      });
      message.success("Feedback submitted successfully!");
      setisFeedBackModal(false);
      setSelectedProductID(null);
      setModalContent("");
      setRating(0);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      message.error("Failed to submit feedback!");
    }
  };

  // const showSupportModal = (type, productId) => {
  //   setModalType(type);
  //   setSelectedProductId(productId);
  //   setIsSupportModalVisible(true);
  // };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div style={{ marginTop: "-10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <OrderTabs
          activeTab={activeTab}
          tabCounts={tabCounts}
          onTabChange={handleTabChange}
        />
      </div>

      <OrderList
        filteredOrders={filteredOrders}
        showOrderDetails={showOrderDetails}
        showFeedbackDetails={showFeedbackDetails}
        pageSize={5}
      />
      <Modal
        title="Feedback"
        open={isFeedBackModal}
        onCancel={handleFeedbackCancel}
        onOk={handleFeedbackOk}
        style={{ marginTop: "3%" }}
      >
        <FeedbackDetail
          orderDetails={orderDetails}
          selectedProductID={selectedProductID}
          setSelectedProductID={setSelectedProductID}
          modalContent={modalContent}
          setModalContent={setModalContent}
          rating={rating}
          setRating={setRating}
        />
      </Modal>

      <Modal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        width={800}
        footer={null}
        style={{ marginTop: "3%" }}
      >
        {selectedOrder && (
          <OrderDetails
            selectedOrder={selectedOrder}
            orderDetails={orderDetails}
            currentPage={currentPage}
            pageSize={2}
            handleTableChange={handleTableChange}
          />
        )}
      </Modal>

      {/* <SupportModal
        isModalVisible={isSupportModalVisible}
        modalType={modalType}
        modalContent={modalContent}
        handleOk={handleSupportOk}
        handleCancel={handleSupportCancel}
        setModalContent={setModalContent}
      /> */}
    </div>
  );
}
