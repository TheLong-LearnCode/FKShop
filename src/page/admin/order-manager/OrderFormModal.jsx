import React, { useState } from "react";
import { Modal, Button, Table, Row, Col, Image } from "antd";
import { formatCurrency } from "../../../util/CurrencyUnit";
import { getModalHeaderMode } from "../../../util/GetModalHeaderMode";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function OrderFormModal({
  mode,
  showModal,
  handleCloseModal,
  selectedOrder,
  selectedOrderDetails,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!selectedOrder) return null;

  const {
    ordersID,
    accountID,
    name,
    province,
    district,
    ward,
    address,
    payingMethod,
    phoneNumber,
    shippingPrice,
    totalPrice,
    status,
    orderDate,
    note,
    user,
  } = selectedOrder;

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
      title: "Order Detail ID",
      dataIndex: "orderDetailsID",
      key: "orderDetailsID",
    },
    {
      title: "Product",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={50} />,
    },
    {
      title: "Product Name", // Thay "Product ID" thành "Product Name"
      dataIndex: "productID",
      key: "productID",
      render: (_, record) => (
        <Link
          to={`/detail/${record.productID}`}
          style={{ textDecoration: "none" }}
        >
          {record.productName.length > 25
            ? `${record.productName.substring(0, 25)}...`
            : record.productName}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price / Item",
      dataIndex: "price",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => formatCurrency(record.price * record.quantity),
    },
  ];

  return (
    <Modal
      open={showModal}
      onCancel={handleCloseModal}
      width="70%"
      title={<h4></h4>}
      footer={null}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Card
            //title={<strong>Order Details</strong>}
            style={{ margin: "10px 20px", padding: "15px" }}
          >
            <Row
              gutter={16}
              // </Card>style={{paddingTop: "30px"}}
            >
              <Col span={10}>
                <Card
                  title={<strong>Customer</strong>}
                  style={{ margin: "20px 20px", padding: "20px 20px" }}
                  hoverable={true}
                >
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={user?.image || "/img/user.png"}
                      alt="Customer Avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <p>
                    <strong>Customer ID:</strong> {accountID}
                  </p>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {phoneNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </p>
                </Card>
              </Col>

              <Col span={14} style={{ paddingTop: "20px" }}>
                <p>
                  <strong>Order ID:</strong> {ordersID}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(orderDate).toLocaleString()}
                </p>
                <p>
                  <strong>Status: </strong>
                  {status.toLowerCase() === "processing"
                    ? "In Progress"
                    : status}
                </p>
                <p>
                  <strong>Payment Method:</strong> {payingMethod}
                </p>
                <p>
                  <strong>Shipping Price:</strong>{" "}
                  {formatCurrency(shippingPrice)}
                </p>
                <p>
                  <strong>Total Price:</strong> {formatCurrency(totalPrice)}
                </p>
                <p>
                  <strong>Address:</strong>
                  {`${address}, ${ward}, ${district}, ${province}`}
                </p>
                <p>
                  <strong>Note:</strong> {note}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <h4>Order Details:</h4>
      <Table
        columns={columns}
        dataSource={selectedOrderDetails}
        rowKey="orderDetailsID"
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: selectedOrderDetails.length,
          onChange: onPageChange,
        }}
      />
    </Modal>
  );
}
