import React, { useState } from "react";
import { Modal, Button, Table, Row, Col, Card } from "antd";
import { getModalHeaderMode } from "../../../util/GetModalHeaderMode";

export default function SupportFormModal({
  mode,
  showModal,
  handleCloseModal,
  selectedSupport,
  user,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!selectedSupport || !selectedSupport.data) return null;

  const { accountID, customerName, labSupports } = selectedSupport.data;
  console.log("USER: ", user);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Support ID",
      dataIndex: ["supporting", "supportingID"],
      key: "supportingID",
    },
    {
      title: "Lab ID",
      dataIndex: "labID",
      key: "labID",
    },
    {
      title: "Lab Name",
      dataIndex: "labName",
      key: "labName",
    },
    {
      title: "Support Times",
      dataIndex: "supporting",
      key: "countSupport",
      render: (supporting, record) =>
        `#${supporting.countSupport}/${record.maxSupTimes}`,
    },
    {
      title: "Status",
      dataIndex: ["supporting", "status"],
      key: "status",
      render: (status) => ["Received", "Approved", "Done"][status],
    },
    {
      title: "Date Post",
      dataIndex: ["supporting", "postDate"],
      key: "postDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expected Support Date",
      dataIndex: ["supporting", "expectedSpDate"],
      key: "expectedSpDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Support Date",
      dataIndex: ["supporting", "supportDate"],
      key: "supportDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
  ];

  return (
    <Modal
      open={showModal}
      onCancel={handleCloseModal}
      width="60%"
      //title={<h4>Customer Information</h4>}
      footer={null}
    >
      <Card>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ textAlign: "center" }}>
              <img
                src={user?.image || "/img/user.png"}
                alt="Customer Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            <p>
              <strong>Customer ID:</strong> {accountID}
            </p>
            <p>
              <strong>Customer Name:</strong> {customerName}
            </p>
            <p>
              <strong>Email: </strong> {user?.email}
            </p>
            <p>
              <strong>Phone: </strong> {user?.phoneNumber}
            </p>
          </Col>
        </Row>
      </Card>

      <h4>Support Details:</h4>
      <Table
        columns={columns}
        dataSource={labSupports}
        rowKey={(record) => record.supporting.supportingID}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: labSupports.length,
          onChange: onPageChange,
        }}
      />
      {/* <h4>Status:</h4>
      <p>
        {["Received", "Approved", "Done"][labSupports[0].supporting?.status]}
      </p> */}
      <h4>Description:</h4>
      <p>{labSupports[0].supporting.description}</p>
    </Modal>
  );
}
