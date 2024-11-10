import React, { useState, startTransition, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Input,
  Space,
  Badge,
  Dropdown,
  Menu,
  Modal,
  Drawer,
  message,
  Row,
  Col,
  Card,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { logout } from "../../../redux/slices/authSlice";
import "./index.css"; // Tạo file CSS mới cho header
import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
import { verifyToken } from "../../../service/authUser";

const { Header } = Layout;
const { Search } = Input;

export default function HeaderLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const user = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await verifyToken(user); // Pass the user's token here
      setUserInfo(response.data);
    }
    fetchUserInfo();
    // if (userInfo === undefined || userInfo === null) {
    //   message.info("Your session has expired!! Please login again");
    //   navigate("/login");
    // }
  }, [user]);

  const handleLogout = () => {
    startTransition(() => {
      dispatch(logout());
      navigate("/");
      Notification("Notification", "LOG OUT SUCCESSFULLY", 3, "success");
    });
  };

  const handleViewProfile = () => {
    console.log("User INFO: ", userInfo);

    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />} onClick={handleViewProfile}>
        View Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Header
        className="bg-white"
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {/* <Search
              placeholder="Search for..."
              onSearch={(value) => console.log(value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            /> */}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 16,
            alignItems: "center",
          }}
        >
          <Space size="large" align="center">
            <Badge dot>
              <BellOutlined className="header-icon" style={{ fontSize: 20 }} />
            </Badge>
            <Dropdown
              overlay={menu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <SettingOutlined
                className="header-icon"
                style={{ fontSize: 20 }}
              />
            </Dropdown>
          </Space>
        </div>
      </Header>

      {/* Drawer hiển thị thông tin người dùng */}
      <Drawer
        title="User Profile"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        width={"30%"}
      >
        {/* Thông tin người dùng trong Card */}
        <Row justify="center">
          <Col span={24}>
            <Card style={{ textAlign: "center" }}>
              <img
                src={userInfo?.image ? userInfo.image : "/img/user.png"}
                alt="Profile"
                className="profile-avatar mb-3"
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "100%",
                }}
              />
              <p>Name: {userInfo?.fullName}</p>
              <p>Email: {userInfo?.email}</p>
              <p>Role: {userInfo?.role}</p>
            </Card>
          </Col>
        </Row>
        {/* Thêm các thông tin khác nếu cần */}
      </Drawer>
    </div>
  );
}
