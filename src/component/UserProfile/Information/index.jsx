import React, { useState } from "react";
import { Alert, Card, Typography, Descriptions, Upload } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  LinuxOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import "./Information.css";

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
    // Handle image upload here, e.g., send to API
    console.log("Uploaded image:", info.file);
  };

  return (
    <Card className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={userInfo.image || "/img/user.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <Upload
            showUploadList={false}
            onChange={handleImageUpload}
          >
            <div className="camera-icon-overlay">
              <CameraOutlined style={{ fontSize: 24 }} />
            </div>
          </Upload>
        </div>

        <Title level={2}>{fullName}</Title>
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label={<><UserOutlined /> Role</>}>
          {role}
        </Descriptions.Item>
        <Descriptions.Item label={<><LinuxOutlined /> Age</>}>
          {age}
        </Descriptions.Item>
        <Descriptions.Item label={<><PhoneOutlined /> Phone Number</>}>
          {phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label={<><MailOutlined /> Email</>}>
          {email}
        </Descriptions.Item>
        <Descriptions.Item label={<><CalendarOutlined /> Participant Date</>}>
          {createDate}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
