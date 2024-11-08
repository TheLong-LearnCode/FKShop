import React from "react";
import { Table, Button, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const LabTable = ({ labs, onEdit, onDelete, onView, onDownloadPDF }) => {
  const columns = [
    { title: "Lab ID", dataIndex: "labID", key: "labID" },
    { title: "Product ID", dataIndex: "productID", key: "productID" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (name ? name.slice(0, 20) + "..." : "N/A"),
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   render: (description) =>
    //     description ? description.slice(0, 10) + "..." : "N/A",
    // },
    { title: "Level", dataIndex: "level", key: "level" },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? (
          <span className="active-status">Active</span>
        ) : (
          <span className="inactive-status">Inactive</span>
        ),
    },
    {
      title: "PDF File",
      dataIndex: "fileNamePDF",
      key: "fileNamePDF",
      render: (fileName) =>
        fileName ? (
          <Space>
            <span>{(fileName.length > 10) ? fileName.slice(0, 10) + "..." : fileName}</span>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => onDownloadPDF(fileName)}
              size="small"
            >
              {/* Download */}
            </Button>
          </Space>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onView(record)}>
            {/* View */}
          </Button>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            {/* Edit */}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.labID)}
            danger
            disabled={record.status === 0}
          >
            {/* Delete */}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={labs}
      rowKey="labID"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default LabTable;
