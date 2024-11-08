import React from "react";
import { Table, Button, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TagTable = ({ tags, onView, onEdit, onDelete }) => {
  const columns = [
    { title: "TagID", dataIndex: ["tag", "tagID"], key: "tagID" },
    { title: "Tag Name", dataIndex: ["tag", "tagName"], key: "tagName" },
    {
      title: "Description",
      dataIndex: ["tag", "description"],
      key: "description",
    },
    {
      title: "Status",
      dataIndex: ["tag", "status"],
      key: "status",
      render: (status) =>
        status === 1 ? (
          <span className="active-status">Active</span>
        ) : (
          <span className="inactive-status">Inactive</span>
        ),
    },
    {
      title: "Categories",
      key: "categories",
      render: (_, record) => (
        <Space direction="vertical">
          {record.cates.map((cate) => (
            <div key={cate.categoryID}>{cate.categoryName}</div>
          ))}
        </Space>
      ),
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
      dataSource={tags}
      rowKey={(record) => record.tag.tagID}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default TagTable;
