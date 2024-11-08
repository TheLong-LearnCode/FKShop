import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Pagination,
  Dropdown,
  Menu,
  Tabs,
  Input,
  message,
  Select,
  Image,
  Empty,
  Badge,
} from "antd";
import { MoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  getSupportByAccountID,
  createSupport,
} from "../../../service/supportService";
import { getLabByProductID } from "../../../service/labService";
import { getOrdersByAccountID } from "../../../service/orderService";
import { getProductById } from "../../../service/productService";
import { getLabByAccountID } from "../../../service/labService";
import "./index.css";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function Support({ userInfo }) {
  const [supports, setSupports] = useState([]);
  const [filteredSupports, setFilteredSupports] = useState([]);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const pageSize = 4;
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [userLabs, setUserLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    received: 0,
    approved: 0,
    done: 0,
    canceled: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.accountID) {
        const supportResponse = await getSupportByAccountID(userInfo.accountID);
        setSupports(supportResponse.data.labSupports);
        setFilteredSupports(supportResponse.data.labSupports);

        // Calculate counts for each tab
        const counts = {
          all: supportResponse.data.labSupports.length,
          received: 0,
          approved: 0,
          done: 0,
          canceled: 0,
        };

        supportResponse.data.labSupports.forEach((support) => {
          switch (support.supporting.status) {
            case 0:
              counts.received++;
              break;
            case 1:
              counts.approved++;
              break;
            case 2:
              counts.done++;
              break;
            case 3:
              counts.canceled++;
              break;
          }
        });

        setTabCounts(counts);

        // Fetch orders
        const orderResponse = await getOrdersByAccountID(userInfo.accountID);
        setOrders(orderResponse.data);

        // Fetch user's labs
        const labResponse = await getLabByAccountID(userInfo.accountID);
        setUserLabs(labResponse.data.orderLabs);

        // Extract unique products from orders and fetch product details
        const uniqueProductIds = new Set();
        orderResponse.data.forEach((order) => {
          order.orderDetails.forEach((detail) => {
            if (detail.isActive === 1) {
              uniqueProductIds.add(detail.productID);
            }
          });
        });

        const productDetails = await Promise.all(
          Array.from(uniqueProductIds).map(async (productId) => {
            const productResponse = await getProductById(productId);
            const product = productResponse.data;
            return {
              id: product.productID,
              name: product.name,
              image: product.images[0]?.url || "default-image-url.jpg",
            };
          })
        );

        setProducts(productDetails);
      }
    };
    fetchData();
  }, [userInfo]);
  const fetchProductDetails = async () => {
    if (selectedLab) {
      const productResponse = await getProductById(selectedLab.lab.productID);
      setSelectedProduct(productResponse.data);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, [selectedLab]);

  useEffect(() => {
    filterSupports(activeTab);
  }, [supports, activeTab]);

  const filterSupports = (status) => {
    if (status === "all") {
      setFilteredSupports(supports);
    } else {
      const statusIndex = ["received", "approved", "done", "canceled"].indexOf(
        status
      );
      setFilteredSupports(
        supports.filter((support) => support.supporting.status === statusIndex)
      );
    }
    setCurrentPage(1);
  };

  const showModal = (type, support) => {
    setSelectedSupport(support);
    setModalType(type);
    setIsModalVisible(true);
    setModalContent("");

    if (type === "Create a Support Request" && support) {
      const selectedLab = userLabs.find(
        (item) => item.lab.labID === support.labID
      );
      setSelectedLab(selectedLab);
      // Fetch product details for the selected lab
      // fetchProductDetails(selectedLab);
    } else {
      setSelectedLab(null);
      setSelectedProduct(null);
    }
  };

  const handleOk = async () => {
    if (modalType === "Create a Support Request") {
      if (!selectedLab) {
        message.error("Please select a lab");
        return;
      }
      try {
        console.log("abc: ", selectedLab.lab.labID);

        await createSupport({
          accountID: userInfo.accountID,
          labID: selectedLab.lab.labID,
          description: modalContent,
        });
        const response = await getSupportByAccountID(userInfo.accountID);
        setSupports(response.data.labSupports);
        message.success("Support request created successfully");
      } catch (error) {
        console.error("Error creating support:", error);
        message.error(error.response.data.message);
      }
    }
    setIsModalVisible(false);
    setModalContent("");
    setSelectedLab(null);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent("");
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item
        key="viewDetail"
        onClick={() => showModal("View Detail", record)}
      >
        View Detail
      </Menu.Item>
      <Menu.Item
        key="createRequest"
        onClick={() => showModal("Create a Support Request", record)}
      >
        Create a Request Support
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Lab Name",
      dataIndex: "labName",
      key: "labName",
    },
    // {
    //   title: "Support Times",
    //   dataIndex: ["maxSupTimes", "supporting", "countSupport"],
    //   key: "countSupport",
    //   render: (maxSupTimes, countSupport, record) => {
    //     return `#${countSupport}/${maxSupTimes}`;
    //   },
    // },
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
      key: "postDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expected Date",
      dataIndex: ["supporting", "expectedSpDate"],
      key: "expectedSpDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "Not Yet",
    },
    {
      title: "Support Date",
      dataIndex: ["supporting", "supportDate"],
      key: "supportDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "Not Yet",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["hover"]}>
          <Button icon={<UnorderedListOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const indexOfLastSupport = currentPage * pageSize;
  const indexOfFirstSupport = indexOfLastSupport - pageSize;
  const currentSupports = filteredSupports.slice(
    indexOfFirstSupport,
    indexOfLastSupport
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const showCreateSupportModal = () => {
    showModal("Create a Support Request", null);
  };

  const locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
    ),
  };

  return (
    <div className="support-container">
      <div className="support-header">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="custom-tabs"
        >
          <TabPane
            tab={
              <Badge count={tabCounts.all} offset={[10, 0]}>
                <span>All</span>
              </Badge>
            }
            key="all"
          />
          <TabPane
            tab={
              <Badge count={tabCounts.received} offset={[10, 0]}>
                <span>Received</span>
              </Badge>
            }
            key="received"
          />
          <TabPane
            tab={
              <Badge count={tabCounts.approved} offset={[10, 0]}>
                <span>Approved</span>
              </Badge>
            }
            key="approved"
          />
          <TabPane
            tab={
              <Badge count={tabCounts.done} offset={[10, 0]}>
                <span>Done</span>
              </Badge>
            }
            key="done"
          />
          <TabPane
            tab={
              <Badge count={tabCounts.canceled} offset={[10, 0]}>
                <span>Canceled</span>
              </Badge>
            }
            key="canceled"
          />
          <TabPane />
        </Tabs>
      </div>

      {/* Thêm nút "Create A Request Support" ở đây */}
      <div style={{ marginBottom: "16px", textAlign: "right" }}>
        <Button type="primary" onClick={showCreateSupportModal}>
          Create A Request Support
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={currentSupports}
        rowKey={(record) => record.supporting.supportingID}
        pagination={false}
        locale={locale}
      />
      {currentSupports.length > 0 && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredSupports.length}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      )}

      <Modal
        title={
          modalType === "Create a Support Request" && selectedSupport
            ? `Create a Support Request #${
                6 - selectedSupport.supporting.countSupport
              }`
            : modalType === "View Detail"
            ? ""
            : modalType
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: "20%" }}
      >
        {modalType === "View Detail" && selectedSupport && (
          <div>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    selectedSupport.supporting.status === 0
                      ? "#006d75"
                      : selectedSupport.supporting.status === 1
                      ? "blue"
                      : selectedSupport.supporting.status === 2
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {
                  ["Received", "Approved", "Done", "Canceled"][
                    selectedSupport.supporting.status
                  ]
                }
              </span>
            </p>
            <p>
              <strong>Lab ID:</strong> {selectedSupport.labID}
            </p>
            <p>
              <strong>Lab Name:</strong> {selectedSupport.labName}
            </p>
            <p>
              <strong>Support Times:</strong>{" "}
              {`#${5 - selectedSupport.supporting.countSupport}`}
            </p>
            <p>
              <strong>Request Date:</strong>{" "}
              {new Date(
                selectedSupport.supporting.postDate
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Expected Date:</strong>{" "}
              {selectedSupport.supporting.expectedSpDate
                ? new Date(
                    selectedSupport.supporting.expectedSpDate
                  ).toLocaleDateString()
                : "Not Yet"}
            </p>
            <p>
              <strong>Support Date:</strong>{" "}
              {selectedSupport.supporting.supportDate
                ? new Date(
                    selectedSupport.supporting.supportDate
                  ).toLocaleDateString()
                : "Not Yet"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedSupport.supporting.description}
            </p>
          </div>
        )}
        {modalType === "Create a Support Request" && (
          <>
            <Select
              style={{ width: "100%", marginBottom: "16px", height: "50px" }}
              placeholder="Select a lab"
              onChange={(value) => {
                const lab = userLabs.find((item) => item.lab.labID === value);
                setSelectedLab(lab);
                fetchProductDetails(lab);
              }}
              value={selectedLab?.lab.labID}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            >
              {/* {userLabs.map((item) => (
                <Option
                  key={item.lab.labID}
                  value={item.lab.labID}
                  style={{ padding: "10px", height: "auto" }}
                >
                  {item.lab.labID} - {item.lab.name}
                </Option>
              ))} */}
              {Array.from(new Set(userLabs.map((item) => item.lab.labID))).map(
                (labID) => {
                  const lab = userLabs.find((item) => item.lab.labID === labID);
                  return (
                    <Option
                      key={labID}
                      value={labID}
                      style={{ padding: "10px", height: "auto" }}
                    >
                      {labID} - {lab.lab.name}
                    </Option>
                  );
                }
              )}
            </Select>
            {selectedProduct && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={
                      selectedProduct.images[0]?.url || "default-image-url.jpg"
                    }
                    alt={selectedProduct.name}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      objectFit: "cover",
                    }}
                  />
                  <span>{selectedProduct.name}</span>
                </div>
              </div>
            )}
            <TextArea
              rows={4}
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
              placeholder="Enter your support request here..."
            />
          </>
        )}
      </Modal>
    </div>
  );
}
