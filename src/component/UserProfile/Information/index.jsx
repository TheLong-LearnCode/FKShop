import React, { useEffect, useState } from "react";
import { Alert, Card, Typography, Descriptions, Upload, Form } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  LinuxOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import "./Information.css";
import { uploadAvater } from "../../../service/uploadImages";

const { Title } = Typography;

export default function ProfileInformation({ userInfo }) {
  const [showMessage, setShowMessage] = useState(true);
  if (!userInfo) {
    return (
      <Alert
        message="Important Notice"
        description="Press CTRL+R to reload the profile!"
        type="info"
        closable
        onClose={() => setShowMessage(false)}
        showIcon
      />
    );
  }

  const { fullName, dob, phoneNumber, email, createDate, role } = userInfo;
  const age = new Date().getFullYear() - new Date(dob).getFullYear();

  // Handle image upload function
  const handleImageUpload = (info) => {
    const formData = new FormData();
    console.log("FILE: ", info.file.originFileObj);
    
    formData.append("image", info.file.originFileObj);

    // Handle image upload here, e.g., send to API
    try {
    const rs = uploadAvater(userInfo?.accountID, formData);
    } catch (e) {
      console.error("Error uploading image:", e);
    }
  };

  const formatDate = (createDate) => {
    const date = new Date(createDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <Card className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={userInfo.image}
            alt="Profile"
            className="profileAvatar"
          />
          <Upload showUploadList={false} onChange={handleImageUpload}>
            <div className="camera-icon-overlay">
              <CameraOutlined style={{ fontSize: 24 }} />
            </div>
          </Upload>
        </div>

        <Title level={2}>{fullName}</Title>
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item
          label={
            <>
              <UserOutlined /> Role
            </>
          }
        >
          {role}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <LinuxOutlined /> Age
            </>
          }
        >
          {age}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <PhoneOutlined /> Phone Number
            </>
          }
        >
          {phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
        >
          {email}
        </Descriptions.Item>

        <Descriptions.Item label={<><CalendarOutlined /> Participant Date</>}>
          {formatDate(createDate)}

        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
