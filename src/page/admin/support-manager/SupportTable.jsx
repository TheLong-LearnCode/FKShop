import React, { useState, useMemo } from "react";
import { Table, Button, Dropdown, Menu, DatePicker, Tabs, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./SupportTable.css";
import UpdateDateModal from "./UpdateDateModal";
const { TabPane } = Tabs;

export default function SupportTable({
  supports,
  currentPage,
  supportsPerPage,
  handleViewSupportDetails,
  handleUpdateSupportStatus,
  handleUpdateSupportDate,
  handleDelete,
  onPageChange,
}) {
  const [datePickerOpen, setDatePickerOpen] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const statusOptions = ["received", "approved", "done", "canceled"];

  const openDateModal = (record) => {
    setSelectedRecord(record);
    setIsDateModalVisible(true);
  };

  const closeDateModal = () => {
    setIsDateModalVisible(false);
    setSelectedRecord(null);
  };

  const onUpdateDate = (date) => {
    if (selectedRecord) {
      handleUpdateSupportDate(selectedRecord, date);
    }
  };

  const handleDatePickerOpen = (record, open) => {
    setDatePickerOpen((prev) => ({
      ...prev,
      [record.supporting.supportingID]: open,
    }));
  };

  const handleDateChange = (record, date) => {
    handleUpdateSupportDate(record, date);
    setDatePickerOpen((prev) => ({
      ...prev,
      [record.supporting.supportingID]: false,
    }));
    setDropdownOpen((prev) => ({
      ...prev,
      [record.supporting.supportingID]: false,
    }));
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * supportsPerPage + index + 1,
    },
    {
      title: "Lab Name",
      dataIndex: "labName",
      key: "labName",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Support Times",
      dataIndex: "supporting",
      key: "countSupport",
      render: (supporting, record) =>
        `#${supporting.countSupport}/${record.maxSupTimes}`,
    },
    {
      title: "Request Date",
      dataIndex: ["supporting", "postDate"],
      key: "requestDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.supporting.postDate) - new Date(b.supporting.postDate),
    },
    // {
    //   title: "Expected Date",
    //   dataIndex: ["supporting", "expectedSpDate"],
    //   key: "expectedDate",
    //   render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    //   sorter: (a, b) => {
    //     if (!a.supporting.expectedSpDate) return -1;
    //     if (!b.supporting.expectedSpDate) return 1;
    //     return new Date(a.supporting.expectedSpDate) - new Date(b.supporting.expectedSpDate);
    //   },
    // },
    {
      title: "Expected Date",
      dataIndex: ["supporting", "expectedSpDate"],
      key: "expectedDate",
      render: (date) =>
        date
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(date))
          : "N/A",
      sorter: (a, b) => {
        if (!a.supporting.expectedSpDate) return -1;
        if (!b.supporting.expectedSpDate) return 1;
        return (
          new Date(a.supporting.expectedSpDate) -
          new Date(b.supporting.expectedSpDate)
        );
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: ["supporting", "status"],
    //   key: "status",
    //   render: (status) => statusOptions[status] || 'Unknown',
    //   sorter: (a, b) => a.supporting.status - b.supporting.status,
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleViewSupportDetails(record)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Dropdown
            open={dropdownOpen[record.supporting.supportingID]}
            onOpenChange={(open) =>
              setDropdownOpen((prev) => ({
                ...prev,
                [record.supporting.supportingID]: open,
              }))
            }
            overlay={
              <Menu>
                <Menu.SubMenu key="setStatus" title="Set Status">
                  {statusOptions.map((status, index) => (
                    <Menu.Item
                      key={status}
                      onClick={() => {
                        handleUpdateSupportStatus(record, index);
                        setDropdownOpen((prev) => ({
                          ...prev,
                          [record.supporting.supportingID]: false,
                        }));
                      }}
                      disabled={record.supporting.status === index}
                    >
                      {status}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
                <Menu.Item
                  key="updateDate"
                  onClick={() => openDateModal(record)}
                >
                  Update Date
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            danger
            onClick={() => handleDelete(record)}
            disabled={record.supporting.status === 2}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const filterSupports = (status) => {
    if (status === "all") {
      return supports;
    } else {
      const statusIndex = statusOptions.indexOf(status);
      return supports.filter(
        (support) => support.supporting.status === statusIndex
      );
    }
  };

  const filteredSupports = filterSupports(activeTab);

  const statusCounts = useMemo(() => {
    const counts = {
      all: supports.length,
      received: 0,
      approved: 0,
      done: 0,
      canceled: 0,
    };

    supports.forEach((support) => {
      const status = statusOptions[support.supporting.status];
      if (status) {
        counts[status]++;
      }
    });

    return counts;
  }, [supports]);

  const renderTabTitle = (title, count) => (
    <span>
      {title} <Badge count={count} style={{ backgroundColor: "#52c41a" }} />
    </span>
  );

  return (
    <div className="support-container">
      <div className="support-header">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="custom-tabs"
        >
          <TabPane tab={renderTabTitle("All", statusCounts.all)} key="all" />
          <TabPane
            tab={renderTabTitle("Received", statusCounts.received)}
            key="received"
          />
          <TabPane
            tab={renderTabTitle("Approved", statusCounts.approved)}
            key="approved"
          />
          <TabPane tab={renderTabTitle("Done", statusCounts.done)} key="done" />
          <TabPane
            tab={renderTabTitle("Canceled", statusCounts.canceled)}
            key="canceled"
          />
        </Tabs>
      </div>
      <Table
        columns={columns}
        dataSource={filteredSupports}
        rowKey={(record) => record.supporting.supportingID}
        pagination={{
          current: currentPage,
          pageSize: supportsPerPage,
          total: filteredSupports.length,
          onChange: onPageChange,
        }}
      />
      <UpdateDateModal
        visible={isDateModalVisible}
        onClose={closeDateModal}
        onUpdateDate={onUpdateDate}
      />
    </div>
  );
}
