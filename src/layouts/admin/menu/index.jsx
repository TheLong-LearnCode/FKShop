import "./index.css";
import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CarOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  CommentOutlined,
  TagsOutlined,
  ProjectOutlined,
  ToolOutlined,
  BookOutlined,
  ApartmentOutlined,
  FilePdfOutlined,
  RobotOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

const AdminMenu = () => {
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <Link to="/admin/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        <Link to="/admin/account-manager">Account</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
        <Link to="/admin/order-manager">Order</Link>
      </Menu.Item>
      <SubMenu
        key="sub1"
        icon={<ExperimentOutlined />}
        title="Lab Support"
        className="dark-submenu"
      >
        <Menu.Item key="4" icon={<CustomerServiceOutlined />}>
          <Link to="/admin/lab-support/support-manager">Support</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<QuestionCircleOutlined />}>
          <Link to="/admin/lab-support/question-manager">Question</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        icon={<AppstoreOutlined />}
        title="Product Manager"
        className="dark-submenu"
      >
        <Menu.Item key="6" icon={<ProjectOutlined />}>
          <Link to="/admin/product-manager/">Kit & Item</Link>
        </Menu.Item>
        {/* <Menu.Item key="7" icon={<RobotOutlined />}>
          <Link to="/admin/product-manager/kit-manager">Kit</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<ToolOutlined />}>
          <Link to="/admin/product-manager/item-manager">Item</Link>
        </Menu.Item> */}
        <Menu.Item key="9" icon={<FilePdfOutlined />}>
          <Link to="/admin/product-manager/lab-manager">Lab</Link>
        </Menu.Item>
        <Menu.Item key="10" icon={<BookOutlined />}>
          <Link to="/admin/product-manager/labGuide-manager">Lab Guide</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="11" icon={<TagsOutlined />}>
        <Link to="/admin/tag-manager">Tag</Link>
      </Menu.Item>
      <Menu.Item key="12" icon={<ApartmentOutlined />}>
        <Link to="/admin/category-manager">Category</Link>
      </Menu.Item>
      <Menu.Item key="13" icon={<FileTextOutlined />}>
        <Link to="/admin/blog-manager">Blog</Link>
      </Menu.Item>
      {/* <Menu.Item key="14" icon={<CarOutlined />}>
        <Link to="/admin/delivery-manager">Delivery</Link>
      </Menu.Item> */}

      <Menu.Item key="15" icon={<CommentOutlined />}>
        <Link to="/admin/feedback-manager">Feedback</Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminMenu;
