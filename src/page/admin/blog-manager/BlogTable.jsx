import React from "react";
import { Table, Button, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
//import HtmlParser from "html-react-parser";

const BlogTable = ({ user, blogs, onView, onEdit, onDelete }) => {
  console.log("USER111: ", user?.fullName);

  
  const columns = [
    { title: "Blog ID", dataIndex: "blogID", key: "blogID" },
    { title: "Blog Name", dataIndex: "blogName", key: "blogName" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "draft" ? "Draft" : "Published"),
    },
    {
      title: "Availability",
      dataIndex: "toDelete",
      key: "toDelete",
      render: (status) =>
        status === 0 ? (
          <span style={{ color: "red", fontWeight: "bold" }}>No</span>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>Yes</span>
        ),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName) => authorName,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags.map((tag) => tag.tagName).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={record.authorName !== user.fullName} 
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
            danger
            disabled={record.authorName !== user.fullName}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={blogs}
      rowKey="blogID"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default BlogTable;
