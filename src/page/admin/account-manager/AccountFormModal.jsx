import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getModalHeaderMode } from "../../../util/GetModalHeaderMode";
import './AccountFormModal.css'
export default function AccountFormModal({
  mode,
  selectedUser,
  admins,
  showModal,
  showDeleteModal,
  showActivateModal, // Trạng thái hiển thị modal xóa
  handleCloseModal,
  handleCloseDeleteModal, // Đóng modal xóa
  handleCloseActivateModal,
  handleSubmit,
  handleConfirmDelete,
  handleConfirmActivate,
}) {
  // Function to determine the header class based on mode
  return (
    <>
      {/* Modal Form */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header className={getModalHeaderMode(mode)}>
          <Modal.Title>
            {mode === "view"
              ? `Viewing User: ${selectedUser?.fullName}`
              : mode === "edit"
              ? `Editing User: ${selectedUser?.fullName}`
              : "Add New User"}
          </Modal.Title>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Form fields... */}
            <Form.Group controlId="formID">
              <Form.Label>Customer ID</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedUser?.accountID}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formAdminID">
              <Form.Label>Admin ID</Form.Label>
              {mode === "view" ? (
                <Form.Control
                  type="text"
                  value={
                    selectedUser?.adminID
                      ? `${selectedUser.adminID} (${
                          admins.find(
                            (admin) => admin.accountID === selectedUser.adminID
                          )?.fullName
                        })`
                      : "None"
                  }
                  readOnly
                />
              ) : (
                <Form.Control
                  as="select"
                  defaultValue={selectedUser?.adminID ?? ""}
                  readOnly={mode === "view"}
                >
                  <option value="">None</option>
                  {admins.map((admin) => (
                    <option key={admin.accountID} value={admin.accountID}>
                      {admin.fullName} ({admin.email})
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedUser?.fullName}
                readOnly={mode === "view"}
              />
            </Form.Group>
            {mode !== "view" && mode !== "edit" && (
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedUser?.password}
                  readOnly={mode === "view"}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of birth</Form.Label>
              <Form.Control
                type="date"
                defaultValue={selectedUser?.dob}
                readOnly={mode === "view"}
              />
            </Form.Group>
            <Form.Group controlId="formPhonenumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedUser?.phoneNumber}
                readOnly={mode === "view"}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                defaultValue={selectedUser?.email}
                readOnly={mode === "view"}
              />
            </Form.Group>
            {/* <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              {selectedUser?.image && (
                <img
                  src={selectedUser.image}
                  alt="User Image"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <Form.Control type="file" readOnly={mode === "view"} />
            </Form.Group> */}
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedUser?.role ?? "user"} // Mặc định chọn "user" nếu không có giá trị
                readOnly={mode === "view"} // Không cho phép chỉnh sửa khi ở chế độ "view"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedUser?.status ?? 0} // Mặc định chọn giá trị 0 nếu không có giá trị
                readOnly={mode === "view"} // Không cho phép chỉnh sửa khi ở chế độ "view"
              >
                <option value={0}>Inactive</option>
                <option value={1}>Active</option>
                <option value={2}>Banned</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {mode !== "view" && (
              <Button variant="primary" type="submit">
                {mode === "add" ? "Create" : "Update"}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Delete */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header>
          <Modal.Title>Delete Account Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showActivateModal} onHide={handleCloseActivateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Activate Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to activate this account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActivateModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmActivate}>
            Activate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
