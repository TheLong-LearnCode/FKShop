import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import Pagination from "../../../util/Pagination";

export default function AccountTable({
  users,
  userInfo,
  currentPage,
  usersPerPage,
  handleView,
  handleEdit,
  handleDelete,
  handleActivate,
  onPageChange,
}) {
  const [sortColumn, setSortColumn] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortColumn]?.toLowerCase() || "";
    let bValue = b[sortColumn]?.toLowerCase() || "";

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Tạo một mảng các item trống để điền vào trang cuối cùng nếu cần
  const emptyItems = Array(Math.max(0, usersPerPage - currentUsers.length)).fill(null);

  return (
    <>
      <Table striped bordered hover responsive>
        {/* <thead style={{ backgroundColor: "var(--forth-color)" }}> */}
        <thead>
          <tr>
            <th>No</th>
            <th onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }}>
              Full Name {sortColumn === "fullName" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {sortColumn === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.status === 0
                  ? "Inactive"
                  : user.status === 1
                  ? "Active"
                  : user.status === 2
                  ? "Banned"
                  : "Unknown"}
              </td>
              <td>
                <Button variant="outline-primary" className="mr-1" onClick={() => handleView(user)}>
                  View
                </Button>
                <Button variant="outline-warning" className="mr-1" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                {user.status === 1 ? (
                  <Button 
                    variant="outline-danger" 
                    onClick={() => handleDelete(user)}
                    disabled={user.accountID === userInfo.accountID}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button variant="outline-success" onClick={() => handleActivate(user)}>
                    Activate
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {emptyItems.map((_, index) => (
            <tr key={`empty-${index}`}>
              <td colSpan="6">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        itemsPerPage={usersPerPage}
        onPageChange={onPageChange}
      />
    </>
  );
}