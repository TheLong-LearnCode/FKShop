import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  //cancelOrder,
  exportExcel,
  getAllOrders,
  getOrderDetailsByOrderID,
  updateOrderStatus,
} from "../../../service/orderService";
import { getProductById } from "../../../service/productService";
import OrderTable from "./OrderTable";
import OrderFormModal from "./OrderFormModal";
import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
import { Modal, notification } from "antd";
import { getUserByAccountID } from "../../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../../service/authUser";
//import { getUserByAccountID } from "../../../service/userService";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const orderDetails = [];
  const [showModal, setShowModal] = useState(false);
  const ordersPerPage = 5;
  const [activeTab, setActiveTab] = useState("all");
  const [exportTimeframe, setExportTimeframe] = useState("week");
  const user = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    fetchUser();
    fetchAllOrders();
  }, [user]);

  const fetchUser = async () => {
    const rs = await verifyToken(user); // Pass the user's token here
    const u = rs.data;
    setUserInfo(u);
  };

  const fetchAllOrders = async () => {
    try {
      const response = await getAllOrders();
      let ordersData = [];
      // Check if response.data has the orders array or if it's directly an array
      if (response.data && response.data.orders) {
        ordersData = Object.values(response.data.orders);
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else {
        console.error("Unexpected data structure:", response.data);
        setOrders([]);
        return;
      }

      // Fetch user data for each order by accountID
      const ordersWithUserDetails = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const userResponse = await getUserByAccountID(order.accountID);
            return { ...order, user: userResponse.data }; // Add user data to each order
          } catch (error) {
            console.error(
              `Error fetching user for accountID ${order.accountID}:`,
              error
            );
            return { ...order, user: null }; // Return order with null user if error occurs
          }
        })
      );

      setOrders(ordersWithUserDetails);
    } catch (error) {
      console.log("Error:", error); //403
      if (error === 403) {
        notification.error({
          message: "Forbidden",
          description: `Role ${userInfo.role} don't have permissions to access this page!!`,
          duration: 5, // Duration in seconds
        });
      }
    }
  };
  const handleNext = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setSelectedOrderDetails([]);
  };

  const handleUpdateOrderStatus = async (order, status) => {
    try {
      Modal.confirm({
        title: "Confirm Update Order's Status",
        content: (
          <div
            dangerouslySetInnerHTML={{
              __html: `The order status is currently <strong style="color: green;">${order.status}</strong>,  
              the next one needs to be updated and is being <strong style="color: red;"> ${status}</strong> !!`,
            }}
          />
        ),
        onOk: async () => {
          try {
            const response = await updateOrderStatus(order.ordersID, status);
            console.log("RESPONSE", response);
            Notification(response.message, "", 4, "success");
            fetchAllOrders();
          } catch (error) {
            console.log("ERROR", error);
            if(error === 403) {
              notification.error({
                message: "Forbidden",
                description: `Role ${userInfo.role} don't have permissions to update order's status!!`,
                duration: 5, // Duration in seconds
              });
            }
            Notification(error.response.data.message, "", 4, "warning");
            
          }
        },
      });
    } catch (error) {}
  };

  const handleViewOrderDetails = (order, orderDetails) => {
    //const accID = order.accountID;
    const fetchOrderDetails = async () => {
      try {
        //BY ORDER ID
        const details = await getOrderDetailsByOrderID(order.ordersID);
        const detailsWithImages = await Promise.all(
          details.data.map(async (detail) => {
            const product = await getProductById(detail.productID);
            return {
              ...detail,
              image: product.data.images[0]?.url,
              productName: product.data.name,
              productType: product.data.type,
            };
          })
        );
        setSelectedOrderDetails(detailsWithImages);
        setSelectedOrder(order);
      } catch (error) {
        console.error("Error fetching order details:", error);
        Notification("Error fetching order details", "", 4, "warning");
      }
    };
    fetchOrderDetails();
    setShowModal(true);
  };

  const handleCancel = async (order) => {
    Modal.confirm({
      title: "Confirm Cancel Order",
      content: (
        <div
          dangerouslySetInnerHTML={{
            __html: `Once you cancel order <strong style="color: red;">${order.ordersID}</strong>, it can no longer be used.`,
          }}
        />
      ),
      onOk: async () => {
        try {
          await updateOrderStatus(order.ordersID, "cancel");
          fetchAllOrders(); // Refresh the order list after cancellation
          Notification("Order canceled successfully", "", 4, "success");
        } catch (error) {
          Notification(error.response.data.message, "", 4, "warning");
        }
      },
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExport = async () => {
    try {
      const fileData = await exportExcel(exportTimeframe);
      const blob = new Blob([fileData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${exportTimeframe}_order_report`; // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up

      URL.revokeObjectURL(downloadUrl); // Release memory
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      Notification("Failed to export Excel file", "", 4, "error");
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">
        <strong>Order:</strong>
      </h2>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end"></Col>
      </Row>

      <OrderTable
        orders={orders}
        orderDetails={orderDetails}
        currentPage={currentPage}
        ordersPerPage={ordersPerPage}
        handleViewOrderDetails={handleViewOrderDetails}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        handleCancel={handleCancel}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onPageChange={handlePageChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleExport={handleExport}
        exportTimeframe={exportTimeframe}
        setExportTimeframe={setExportTimeframe}
      />

      <OrderFormModal
        mode={mode}
        orderDetails={orderDetails}
        selectedOrder={selectedOrder}
        selectedOrderDetails={selectedOrderDetails}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </Container>
  );
}
