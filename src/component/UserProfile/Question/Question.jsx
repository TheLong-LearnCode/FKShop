import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Pagination,
    Tabs,
    Input,
    message,
    Select,
    Image,
    Empty,
    Badge,
} from "antd";
import '../Support/index.css'
import api from '../../../config/axios';
import { GET, POST } from '../../../constants/httpMethod';
import { getProductById } from "../../../service/productService";
import { getLabByAccountID } from "../../../service/labService";
import { getOrdersByAccountID } from "../../../service/orderService";


const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function Question({ userInfo }) {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
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
        notRespondedYet: 0,
        responded: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo?.accountID) {
                const questionResponse = await api[GET](`questions/byAccountID/${userInfo.accountID}`);
                setQuestions(questionResponse.data.data);
                setFilteredQuestions(questionResponse.data.data);

                // Calculate counts for each tab
                const counts = {
                    all: questionResponse.data.data.length,
                    notRespondedYet: 0,
                    responded: 0,
                };

                questionResponse.data.data.forEach((question) => {
                    switch (question.status) {
                        case 0:
                            counts.notRespondedYet++;
                            break;
                        case 1:
                            counts.responded++;
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

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (selectedLab) {
                const productResponse = await getProductById(selectedLab.lab.productID);
                setSelectedProduct(productResponse.data);
            }
        };
        fetchProductDetails();
    }, [selectedLab]);

    useEffect(() => {
        filterQuestions(activeTab);
    }, [questions, activeTab]);

    const filterQuestions = (status) => {
        if (status === "all") {
            setFilteredQuestions(questions);
        } else {
            const statusIndex = ["notRespondedYet", "responded"].indexOf(
                status
            );
            setFilteredQuestions(
                questions.filter((questions) => questions.status === statusIndex)
            );
        }
        setCurrentPage(1);
    };

    const showModal = (type, question) => {
        setSelectedQuestion(question);
        setModalType(type);
        setIsModalVisible(true);
        setModalContent("");

        if (type === "Create a Question" && question) {
            const selectedLab = userLabs.find(
                (item) => item.lab.labID === support.labID
            );
            setSelectedLab(selectedLab);
            // Fetch product details for the selected lab
            fetchProductDetails(selectedLab);
        } else {
            setSelectedLab(null);
            setSelectedProduct(null);
        }
    };

    const handleOk = async () => {
        if (modalType === "Create a Question") {
            if (!selectedLab) {
                message.error("Please select a lab");
                return;
            }
            try {
                await api[POST]('questions', {
                    accountID: userInfo.accountID,
                    labID: selectedLab.lab.labID,
                    description: modalContent
                });

                const response = await api[GET](`questions/byAccountID/${userInfo.accountID}`);
                setQuestions(response.data.data);
                message.success("Question created successfully");
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

    const columns = [
        {
            title: "Lab Name",
            dataIndex: "labName",
            key: "labName",
        },
        {
            title: "Ask Date",
            dataIndex: "postDate",
            key: "postDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Response Date",
            dataIndex: "responseDate",
            key: "responseDate",
            render: (date) =>
                date ? new Date(date).toLocaleDateString() : "Not Yet",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    key="viewDetail"
                    onClick={() => showModal("View Detail", record)}
                >
                    View Detail
                </Button>
            ),
        },
    ];

    const indexOfLastQuestion = currentPage * pageSize;
    const indexOfFirstQuestion = indexOfLastQuestion - pageSize;
    const currentQuestions = filteredQuestions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const showCreateQuestionModal = () => {
        showModal("Create a Question", null);
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
                            <Badge count={tabCounts.notRespondedYet} offset={[10, 0]}>
                                <span>Not Responded Yet</span>
                            </Badge>
                        }
                        key="notRespondedYet"
                    />
                    <TabPane
                        tab={
                            <Badge count={tabCounts.responded} offset={[10, 0]}>
                                <span>Responded</span>
                            </Badge>
                        }
                        key="responded"
                    />
                    <TabPane />
                </Tabs>
            </div>

            {/* Thêm nút "Create A Request Support" ở đây */}
            <div style={{ marginBottom: "16px", textAlign: "right" }}>
                <Button type="primary" onClick={showCreateQuestionModal}>
                    Create A Question
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={currentQuestions}
                rowKey={(record) => record.questionID}
                pagination={false}
                locale={locale}
            />
            {currentQuestions.length > 0 && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        total={filteredQuestions.length}
                        pageSize={pageSize}
                        onChange={onPageChange}
                    />
                </div>
            )}

            <Modal
                title= {modalType === "View Detail" ? "View Detail" : "Create A Question"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ top: "20%" }}
            >
                {modalType === "View Detail" && selectedQuestion && (
                    <div>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                style={{
                                    color:
                                        selectedQuestion.status === 0
                                            ? "red"
                                            : "green",                          
                                    fontWeight: "bold",
                                }}
                            >
                                {
                                    ["Not Responded Yet", "Responded"][
                                    selectedQuestion.status
                                    ]
                                }
                            </span>
                        </p>
                        <p>
                            <strong>Lab Name:</strong> {selectedQuestion.labName}
                        </p>
                        <p>
                            <strong>Ask Date:</strong>{" "}
                            {new Date(
                                selectedQuestion.postDate
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Response Date:</strong>{" "}
                            {selectedQuestion.responseDate
                                ? new Date(
                                    selectedQuestion.responseDate
                                ).toLocaleDateString()
                                : "Not Yet"}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {selectedQuestion.description}
                        </p>
                        <p>
                            <strong>Response Answer:</strong>{" "}
                            {selectedQuestion.response ? selectedQuestion.response : "Not Answer Yet"} 
                        </p>
                    </div>
                )}
                {modalType === "Create a Question" && (
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
                           
                            {Array.from(new Set(userLabs.map(item => item.lab.labID))).map((labID) => {
                                const lab = userLabs.find(item => item.lab.labID === labID);
                                return (
                                    <Option
                                        key={labID}
                                        value={labID}
                                        style={{ padding: "10px", height: "auto" }}
                                    >
                                        {labID} - {lab.lab.name}
                                    </Option>
                                );
                            })}
                        </Select>
                        {selectedProduct && (
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Image
                                        src={selectedProduct.images[0]?.url || "default-image-url.jpg"}
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
                            placeholder="Enter your question here..."
                        />
                    </>
                )}
            </Modal>
        </div>
    )
}
