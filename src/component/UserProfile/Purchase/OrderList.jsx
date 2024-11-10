import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { formatCurrency } from "../../../util/CurrencyUnit";

const formatDate = (createDate) => {
  const date = new Date(createDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const OrderList = ({ filteredOrders, showOrderDetails, showFeedbackDetails, pageSize }) => {

  const columns = [
    {
      title: "Order ID",
      dataIndex: ["orders", "ordersID"],
      key: "ordersID",
    },
    {
      title: "Order Date",
      dataIndex: ["orders", "orderDate"],
      key: "orderDate",
      render: (orderDate) => formatDate(orderDate),
    },
    {
      title: "Paying Method",
      dataIndex: ["orders", "payingMethod"],
      key: "payingMethod",
    },
    {
      title: "Total Price",
      dataIndex: ["orders", "totalPrice"],
      key: "totalPrice",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Status",
      dataIndex: ["orders", "status"],
      key: "status",
      render: (status) => status, // Thêm dòng này để chuyển đổi hiển thị
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button onClick={() => showOrderDetails(record.orders.ordersID)}>
            View
          </Button>

          <Button
            style={{ marginTop: '5px', marginLeft: '5px'  }}
            onClick={() => showFeedbackDetails(record.orders.ordersID)}
            disabled={record.orders.status !== "delivered"}
          >
            Feedback
          </Button>
        </div>

      ),
    },
  ];

  return (
    <Table
      columns={columns}

      dataSource={filteredOrders}
      rowKey={(record) => record.orders.ordersID}
      pagination={{ pageSize: pageSize }}
    />
  );
};

export default OrderList;
