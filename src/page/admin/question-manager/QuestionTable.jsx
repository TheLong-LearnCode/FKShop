import React from "react";
import { Table, Button, Dropdown, Menu } from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  ToolOutlined,
} from "@ant-design/icons";

export default function QuestionTable({
  questions,
  currentPage,
  questionsPerPage,
  handleView,
  handleResponse,
  handleDelete,
  onPageChange,
}) {
  const columns = [
    // {
    //   title: "No",
    //   dataIndex: "index",
    //   key: "index",
    //   render: (_, __, index) =>
    //     (currentPage - 1) * questionsPerPage + index + 1,
    // },
    {
      title: "Question ID",
      dataIndex: "questionID",
      key: "questionID",
    },
    // {
    //   title: "Lab ID",
    //   dataIndex: "labID",
    //   key: "labID",
    // },
    { title: "Lab Name", dataIndex: "labName", key: "labName" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? (
          <span className="active-status">Answered</span>
        ) : (
          <span className="inactive-status">Not yet</span>
        ),
    },
    // {
    //   title: "Response message",
    //   dataIndex: "response",
    //   key: "response",
    // },
    {
      title: "Date Posted",
      dataIndex: "postDate",
      key: "postDate",
      render: (date) =>
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(date)),
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
    },
    {
      title: "Response Date",
      dataIndex: "responseDate",
      key: "responseDate",
      render: (date) =>
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(date)),
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ marginRight: 8 }}
          ></Button>
          <Button
            icon={<ToolOutlined />}
            onClick={() => handleResponse(record)}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
            disabled={record.status === 2}
            style={{ marginLeft: 8 }}
          ></Button>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={questions}
      rowKey="questionID"
      pagination={{
        current: currentPage,
        pageSize: questionsPerPage,
        total: questions.length,
        onChange: onPageChange,
      }}
    />
  );
}
