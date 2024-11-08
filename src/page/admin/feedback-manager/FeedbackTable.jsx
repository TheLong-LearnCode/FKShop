import React from "react";
import { Table, Button, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const FeedbackTable = ({ feedbacks, onView, onEdit, onDelete }) => {
  const columns = [
    { title: "FeedbackID", dataIndex: "feedbackID", key: "feedbackID" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (date) =>
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(date)),
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={feedbacks}
      rowKey="feedbackID"
      pagination={{ pageSize: 4 }}
    />
  );
};

export default FeedbackTable;
