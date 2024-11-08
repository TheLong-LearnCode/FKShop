import { Modal, Rate, Select } from "antd";
import { useEffect, useState } from "react";
import { getProductById } from "../../../service/productService";
import TextArea from "antd/es/input/TextArea";
import './FeedbackDetail.css'

export default function FeedbackDetail({ orderDetails, selectedProductID, setSelectedProductID, modalContent, setModalContent, rating, setRating}) {

    const handleChange = (value) => {
        setSelectedProductID(value);
    };

    const handleChangeRate = (value) => {
        setRating(value);
    };


    return (
        <div>
            <Select
                style={{ width: "100%", marginBottom: "16px", height: "50px" }}
                placeholder="Select a product"
                onChange={handleChange}
                value={selectedProductID}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            >
                {Array.isArray(orderDetails) && orderDetails.map((order) => (
                    <Option key={order.orderID} value={order.productID} style={{ padding: "10px", height: "auto" }}>
                        <div className="d-flex align-items-center">
                            <img src={order.image} alt={order.productName} style={{ width: '30px', height: '30px' }} />
                            <p className="ml-2 mb-0">{order.productName}</p>
                        </div>
                    </Option>
                ))}
            </Select>

            <h6>Rating</h6>

            <Rate
                tooltips={['Very bad', 'Bad', 'Okay', 'Good', 'Very good']}
                onChange={handleChangeRate}
                className="mb-3"
                value={rating}
            ></Rate>

            <h6>Description</h6>

            <TextArea
                rows={4}
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
                placeholder="Enter your feedback here..."
            />
        </div>
    )
}
