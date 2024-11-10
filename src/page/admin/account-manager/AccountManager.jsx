import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "boxicons";
import {
  createAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount,
  activateAccount,
} from "../../../service/userService";
import AccountTable from "./AccountTable";
import AccountFormModal from "./AccountFormModal";
import { Notification } from "../../../util/Notification";
import { useSelector } from "react-redux";
import { verifyToken } from "../../../service/authUser";
import { uploadAvater } from "../../../service/uploadImages";

export default function AccountManager() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]); // List of admin accounts for dropdown
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState("list"); // 'list', 'add', 'view', 'edit'
  const [selectedUser, setSelectedUser] = useState(null); // To store selected user data for view/edit
  const [showModal, setShowModal] = useState(false); // Control modal visibility for form
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Control modal visibility for delete
  const [showActivateModal, setShowActivateModal] = useState(false); // Control modal visibility for activate
  const [userToDelete, setUserToDelete] = useState(null); // Store user to be deleted
  const [userToActivate, setUserToActivate] = useState(null); // Store user to be activated
  const user = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null); // Store user
  const usersPerPage = 5;

  useEffect(() => {
    const fetchAllAccounts = async () => {
      try {
        const response = await getAllAccounts();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchUserInfo = async () => {
      try {
        const response = await verifyToken(user);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchAllAccounts();
    fetchUserInfo();
  }, [user]);

  const fetchAdmins = async () => {
    try {
      const response = await getAllAccounts(); // Gọi API để lấy danh sách tất cả accounts
      const adminAccounts = response.data.filter(
        (account) => account.role === "admin"
      );
      setAdmins(adminAccounts); // Lưu danh sách các admin vào state
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddNew = () => {
    fetchAdmins(); // Gọi API để lấy danh sách admin
    setSelectedUser(null); // Clear selected user for new addition
    setMode("add");
    setShowModal(true); // Show modal
  };

  const handleView = (user) => {
    setSelectedUser(user); // Set user for viewing
    setMode("view");
    setShowModal(true); // Show modal
  };

  const handleEdit = (user) => {
    fetchAdmins(); // Gọi API để lấy danh sách admin
    setSelectedUser(user); // Set user for editing
    setMode("edit");
    setShowModal(true); // Show modal
  };

  // Hàm này sẽ mở modal xác nhận xóa

  const handleDelete = (user) => {
    setUserToDelete(user); // Lưu thông tin user cần xóa
    setShowDeleteModal(true); // Hiển thị modal xác nhận
  };

  const handleActivate = (user) => {
    setUserToActivate(user); // Store user to be activated
    setShowActivateModal(true); // Show confirmation modal for activation
  };

  const confirmActivate = async () => {
    try {
      const response = await activateAccount(userToActivate.accountID);
      Notification("User has been activated", "", 4, "success");
      //Notification("response.message", "", 4, "success");
      const updatedResponse = await getAllAccounts();
      setUsers(updatedResponse.data);
    } catch (error) {
      console.error("Error activating user:", error);
      Notification("Error activating user", "", 4, "warning");
    } finally {
      setShowActivateModal(false); // Close the modal after activation
      setUserToActivate(null); // Clear the user to be activated
    }
  };

  // Xử lý xóa sau khi người dùng xác nhận

  const confirmDelete = async () => {
    try {
      const response = await deleteAccount(userToDelete.accountID); // Gọi API xóa
      Notification(response.message, "", 4, "info");

      // Gọi lại API để lấy danh sách người dùng mới nhất
      const updatedResponse = await getAllAccounts();
      setUsers(updatedResponse.data); // Cập nhật lại danh sách người dùng sau khi xóa
    } catch (error) {
      console.error("Error deleting user:", error);
      Notification("Error deleting user", "", 4, "warning");
    } finally {
      setShowDeleteModal(false); // Đóng modal sau khi xóa
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMode("list"); // Go back to list view
  };

  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false); // Đóng modal xác nhận xóa
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn việc reload lại trang khi submit form
    console.log("AA: ", e.target.formImage.value);
    
    const formData = {
      fullName: e.target.formFullName.value,
      email: e.target.formEmail.value,
      password: e.target.formPassword?.value,
      dob: e.target.formDateOfBirth.value,
      image: e.target.formImage.value,
      phoneNumber: e.target.formPhonenumber.value,
      role: e.target.formRole.value,
      status: e.target.formStatus.value,
      adminID: e.target.formAdminID.value,
    };
    const form = new FormData();
    form.append("image", e.target.formImage.value);

    try {
      if (mode === "add") {
        const response = await createAccount(formData);
        Notification(response.message, "", 4, "success");
      } else if (mode === "edit") {
        //let formData2;
        const { password, ...formData2 } = formData;
        console.log("formData2: ", formData2);

        const response = await updateAccount(formData2, selectedUser.accountID);
        const avatar = await uploadAvater(selectedUser.accountID,form);
        Notification(response.message, "", 4, "success");
      }
      setShowModal(false); // Close modal after success
      setMode("list");
      // Fetch lại danh sách người dùng sau khi thêm/sửa
      const response = await getAllAccounts();
      setUsers(response.data);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container fluid>
      <h2 className="my-4">
        <strong>List Users:</strong>
      </h2>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          {/* <Button variant="outline-success" className="mr-1">
            <box-icon name="export"></box-icon> Export
          </Button> */}
          
          <Button variant="outline-info" onClick={handleAddNew}>
            <box-icon name="plus"></box-icon> Add New
          </Button>
        </Col>
      </Row>

      <AccountTable
        users={users}
        userInfo={userInfo}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleActivate={handleActivate}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onPageChange={handlePageChange}
      />

      <AccountFormModal
        mode={mode}
        selectedUser={selectedUser}
        showModal={showModal}
        admins={admins} // Truyền danh sách admin xuống modal
        showDeleteModal={showDeleteModal}
        userToDelete={userToDelete}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleConfirmDelete={confirmDelete}
        showActivateModal={showActivateModal}
        handleConfirmActivate={confirmActivate}
        userToActivate={userToActivate}
        handleCloseModal={handleCloseModal}
        handleCloseActivateModal={handleCloseActivateModal}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
}
