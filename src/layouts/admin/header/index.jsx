// import React, { useState, startTransition, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Layout,
//   Input,
//   Space,
//   Badge,
//   Dropdown,
//   Menu,
//   Drawer,
//   message,
//   Row,
//   Col,
//   Card,
//   Button,
// } from "antd";
// import {
//   SearchOutlined,
//   BellOutlined,
//   SettingOutlined,
//   UserOutlined,
//   LogoutOutlined,
//   HomeOutlined,
// } from "@ant-design/icons";
// import { logout } from "../../../redux/slices/authSlice";
// import "./index.css";
// import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
// import { verifyToken } from "../../../service/authUser";
// import { updateUser } from "../../../service/userService";

// const { Header } = Layout;

// export default function HeaderLayout() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);
//   const user = useSelector((state) => state.auth);
//   const [userInfo, setUserInfo] = useState(null);
//   const [editableUserInfo, setEditableUserInfo] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     async function fetchUserInfo() {
//       const response = await verifyToken(user);
//       setUserInfo(response.data);
//       setEditableUserInfo(response.data); // Initialize editable fields
//     }
//     fetchUserInfo();
//   }, [user]);

//   const handleLogout = () => {
//     startTransition(() => {
//       dispatch(logout());
//       navigate("/");
//       Notification("Notification", "LOG OUT SUCCESSFULLY", 3, "success");
//     });
//   };

//   const handleViewProfile = () => {
//     setIsDrawerVisible(true);
//   };

//   const closeDrawer = () => {
//     setIsDrawerVisible(false);
//     setIsEditing(false);
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = async() => {
//     console.log("Editable User: ", editableUserInfo);
    
//     const response = await updateUser(editableUserInfo, userInfo.accountID);
//     message.success(response.message);
//     setUserInfo(editableUserInfo); // Update original user info with edited data
//     setIsEditing(false);
//     Notification("Notification", "Profile updated successfully!", 3, "success");
//   };

//   const handleChange = (field, value) => {
//     setEditableUserInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleReturnHome = () => {
//     navigate("/");
//   };

//   const menu = (
//     <Menu>
//       <Menu.Item key="1" icon={<HomeOutlined />} onClick={handleReturnHome}>
//         My Home Page
//       </Menu.Item>
//       <Menu.Item key="1" icon={<UserOutlined />} onClick={handleViewProfile}>
//         View Profile
//       </Menu.Item>
//       <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
//         Log out
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <div>
//       <Header
//         className="bg-white"
//         style={{
//           padding: 0,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ flex: 1 }}></div>
//         <div style={{ flex: 1, display: "flex", justifyContent: "center" }}></div>
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             justifyContent: "flex-end",
//             marginRight: 16,
//             alignItems: "center",
//           }}
//         >
//           <Space size="large" align="center">
//             <Badge dot>
//               <BellOutlined className="header-icon" style={{ fontSize: 20 }} />
//             </Badge>
//             <Dropdown
//               overlay={menu}
//               placement="bottomRight"
//               trigger={["click"]}
//             >
//               <SettingOutlined
//                 className="header-icon"
//                 style={{ fontSize: 20 }}
//               />
//             </Dropdown>
//           </Space>
//         </div>
//       </Header>

//       <Drawer
//         title="User Profile"
//         placement="right"
//         closable={true}
//         onClose={closeDrawer}
//         visible={isDrawerVisible}
//         width={"30%"}
//       >
//         <Row justify="center">
//           <Col span={24}>
//             <Card style={{ textAlign: "center" }}>
//               <img
//                 src={userInfo?.image ? userInfo.image : "/img/user.png"}
//                 alt="Profile"
//                 className="profile-avatar mb-3"
//                 style={{
//                   height: "100px",
//                   width: "100px",
//                   borderRadius: "100%",
//                 }}
//               />
//               {isEditing ? (
//                 <>
//                   <Input
//                     placeholder="Full Name"
//                     value={editableUserInfo?.fullName}
//                     onChange={(e) => handleChange("fullName", e.target.value)}
//                     className="mb-2"
//                   />
//                   <Input
//                     placeholder="Email"
//                     value={editableUserInfo?.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     className="mb-2"
//                   />
//                   <Input
//                     placeholder="Role"
//                     value={editableUserInfo?.role}
//                     onChange={(e) => handleChange("role", e.target.value)}
//                     className="mb-2"
//                   />
//                   <Button type="primary" onClick={handleSaveClick}>
//                     Save
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <p>Name: {userInfo?.fullName}</p>
//                   <p>Email: {userInfo?.email}</p>
//                   <p>Role: {userInfo?.role}</p>
//                   <Button type="primary" onClick={handleEditClick}>
//                     Edit
//                   </Button>
//                 </>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Drawer>
//     </div>
//   );
// }
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
  Drawer,
  message,
  Row,
  Col,
  Card,
  Button,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { logout } from "../../../redux/slices/authSlice";
import "./index.css";
import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
import { verifyToken } from "../../../service/authUser";
import { updateUser } from "../../../service/userService";
import moment from "moment";

const { Header } = Layout;

export default function HeaderLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const user = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [editableUserInfo, setEditableUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await verifyToken(user);
      setUserInfo(response.data);
      setEditableUserInfo(response.data); // Initialize editable fields
    }
    fetchUserInfo();
  }, [user]);

  const handleLogout = () => {
    startTransition(() => {
      dispatch(logout());
      navigate("/");
      Notification("Notification", "LOG OUT SUCCESSFULLY", 3, "success");
    });
  };

  const handleViewProfile = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const response = await updateUser(editableUserInfo, userInfo.accountID);
    message.success(response.message);
    setUserInfo(editableUserInfo); // Update original user info with edited data
    setIsEditing(false);
    Notification("Notification", "Profile updated successfully!", 3, "success");
  };

  const handleChange = (field, value) => {
    setEditableUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<HomeOutlined />} onClick={handleReturnHome}>
        My Home Page
      </Menu.Item>
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
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}></div>
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

      <Drawer
        title="User Profile"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        width={"30%"}
      >
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
              {isEditing ? (
                <>
                  <Input
                    placeholder="Full Name"
                    value={editableUserInfo?.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="mb-2"
                    style={{ marginLeft: "77px", paddingRight: "50px" }}
                  />
                  <Input
                    placeholder="Email"
                    value={editableUserInfo?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mb-2"
                    style={{ marginLeft: "77px", paddingRight: "50px" }}
                  />
                  <DatePicker
                    placeholder="Date of Birth"
                    value={
                      editableUserInfo?.dob
                        ? moment(editableUserInfo.dob, "YYYY-MM-DD")
                        : null
                    }
                    onChange={(date, dateString) =>
                      handleChange("dob", dateString)
                    }
                    className="mb-2"
                    format="YYYY-MM-DD"
                  />
                  <Button type="primary" onClick={handleSaveClick}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <p>Name: {userInfo?.fullName}</p>
                  <p>Email: {userInfo?.email}</p>
                  <p>Role: {userInfo?.role}</p>
                  <p>Date of Birth: {userInfo?.dob || "NaN"}</p>
                  <Button type="primary" onClick={handleEditClick}>
                    Edit
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
}
