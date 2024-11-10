import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SupportTable from "./SupportTable";
import SupportFormModal from "./SupportFormModal";
import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
import {
  getAllSupport,
  updateSupportStatus,
  getSupportByAccountIDAndSupportingID,
  updateSupportDate,
} from "../../../service/supportService";
import { notification } from "antd";
import { useSelector } from "react-redux";
import { verifyToken } from "../../../service/authUser";
import { getUserByAccountID } from "../../../service/userService";

export default function SupportManager() {
  const [supports, setSupports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState("list");
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const supportsPerPage = 5;
  const [userGetSupport, setUserGetSupport] = useState(null);
  const user = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchAllSupports();
    fetchUser();
  }, [user]);

  const fetchUser = async () => {
    const rs = await verifyToken(user); // Pass the user's token here
    const u = rs.data;
    setUserInfo(u);
  };

  const fetchAllSupports = async () => {
    try {
      const response = await getAllSupport();
      if (response.data && Array.isArray(response.data)) {
        setSupports(response.data);
      }
      console.log("RESPONSE.DATA: ", response.data);

      Notification(response.message, "", 4, "success");
    } catch (error) {
      console.error("Error fetching supports:", error);
      if (error === 403) {
        notification.error({
          message: "Forbidden",
          description: `Role ${userInfo.role} don't have permissions to view support lists!!`,
          duration: 5, // Duration in seconds
        });
      }
      Notification("Error fetching supports", "", 4, "error");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupport(null);
  };

  const handleUpdateSupportStatus = async (support, status) => {
    try {
      const response = await updateSupportStatus({
        supportingID: support.supporting.supportingID,
        status: status,
      });
      Notification(response.message, "", 4, "success");
      fetchAllSupports();
    } catch (error) {
      console.log("Error updating support status:", error);
      if (error === 403) {
        notification.error({
          message: "Forbidden",
          description: `Role ${userInfo.role} don't have permissions to updating support status!!`,
          duration: 5, // Duration in seconds
        });
      }
      Notification("Error updating support status", "", 4, "warning");
    }
  };

  const handleViewSupportDetails = async (support) => {
    try {
      // Fetch support details
      const response = await getSupportByAccountIDAndSupportingID(
        support.accountID,
        support.supporting.supportingID
      );
      setSelectedSupport(response);
      try {
        const userResponse = await getUserByAccountID(support.accountID);
        setUserGetSupport(userResponse.data);
      } catch (error) {
        console.error(
          `Error fetching user for accountID ${support.accountID}:`,
          error
        );
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching support details:", error);
      if (error === 403) {
        notification.error({
          message: "Forbidden",
          description: `Role ${userInfo.role} doesn't have permissions to view support detail!`,
          duration: 5, // Duration in seconds
        });
      }
      Notification("Error fetching support details", "", 4, "error");
    }
  };

  const handleDelete = async (support) => {
    try {
      // Implement the actual API call here
      // await deleteSupport(support.supporting.supportingID);
      fetchAllSupports();
      Notification("Support deleted successfully", "", 4, "success");
    } catch (error) {
      console.error("Error deleting support:", error);
      if (error === 403) {
        notification.error({
          message: "Forbidden",
          description: `Role ${userInfo.role} don't have permissions to delete support!!`,
          duration: 5, // Duration in seconds
        });
      }
      Notification("Error deleting support", "", 4, "warning");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUpdateSupportDate = async (support, date) => {
    try {
      const response = await updateSupportDate({
        supportingID: support.supporting.supportingID,
        date: date.format("YYYY-MM-DD"),
      });
      Notification(response.message, "", 4, "success");
      fetchAllSupports();
    } catch (error) {
      console.log("Error updating support date:", error);
      Notification("Error updating support date", "", 4, "warning");
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">
        <strong>Support:</strong>
      </h2>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end"></Col>
      </Row>

      <SupportTable
        supports={supports}
        currentPage={currentPage}
        supportsPerPage={supportsPerPage}
        handleViewSupportDetails={handleViewSupportDetails}
        handleUpdateSupportStatus={handleUpdateSupportStatus}
        handleUpdateSupportDate={handleUpdateSupportDate}
        handleDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      <SupportFormModal
        mode={mode}
        selectedSupport={selectedSupport}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        user={userGetSupport}
      />
    </Container>
  );
}
