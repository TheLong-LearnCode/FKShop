import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./styles.css";

const UnauthorizedPage = () => {
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  return (
    <Container
      fluid
      className="unauthorized-container d-flex align-items-center justify-content-center"
    >
      <Row className="text-center">
        <Col xs={12} className="unauthorized-content">
          <FaExclamationTriangle size={50} className="text-warning mb-4" />
          <h1 className="unauthorized-title">401 - Unauthorized</h1>
          <p className="unauthorized-text">
            Sorry, <strong>{userInfo?.fullName || "user"}</strong>,
            your role is <strong>{userInfo?.role}</strong>, you don't have permission to access this page.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" className="mt-3">
              Return to Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;
