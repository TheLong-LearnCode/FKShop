import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Menu from "./menu";
import HeaderLayout from "./header";
import Loading from "../../component/Loading/Loading";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { loadUserFromCookie } from "../../service/authUser";
import { useDispatch } from "react-redux";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get("token");
    dispatch(loadUserFromCookie(token));
    console.log("token in AdminLayout",token);
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  if (loading) {
    return (
      <>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
            <div
              className="logo"
              style={{
                height: "32px",
                margin: "16px",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
            <Menu />
          </Sider>
          <Layout>
            <HeaderLayout />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                position: "absolute",
                top: 0,
                left: collapsed ? 80 : 250,
                zIndex: 1001,
              }}
            />
            <Content
              style={{
                margin: "44px 8px 12px",
                padding: 24,
                minHeight: 280,
                background: "#fff",
              }}
            >
              <Loading />
            </Content>
          </Layout>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
          <div
            className="logo"
            style={{
              height: "32px",
              margin: "16px",
              background: "rgba(255, 255, 255, 0.3)",
            }}
          />
          <Menu />
        </Sider>
        <Layout>
          <HeaderLayout />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              position: "absolute",
              top: 0,
              left: collapsed ? 80 : 250,
              zIndex: 1001,
            }}
          />
          <Content
            style={{
              margin: "20px 8px 12px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminLayout;
