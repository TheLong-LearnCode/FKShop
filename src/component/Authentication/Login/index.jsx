import React, { useState, useEffect, useTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./index.css";
import SignUpForm from "../SignUp/index.jsx";
import SignInForm from "../SignIn/index.jsx";
import Validator from "../../Validator/index.jsx";
import { message } from "antd";
import { register, login, verifyToken } from "../../../service/authUser.jsx";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_STAFF } from "../../../constants/role.js";
import {
  PASSWORD_LENGTH,
  TOTAL_DIGITS_PHONE_NUMBER,
} from "../../../constants/fomConstrant.js";

function SignInSignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("signin");
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  const handleTabClick = (tab) => {
    startTransition(() => {
      setActiveTab(tab);
      if (tab === "signin") {
        navigate("/login"); // Điều hướng đến /login
      } else {
        navigate("/register"); // Điều hướng đến /register
      }
      document.getElementById(`tab-content-${tab}`).scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    // Set activeTab based on the current path
    const currentPath = location.pathname.replace("/", "");
    setActiveTab(currentPath === "register" ? "signup" : "signin");
  }, [location]);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    if (activeTab === "signin") {
      Validator({
        form: "#form-sign-in",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
          Validator.isEmail("#form-sign-in #email"),
          Validator.minLength("#form-sign-in #password", 6),
        ],
        onSubmit: async (data) => {
          try {
            const user = {
              email: data.email,
              password: data.password,
            };
            const resultAction = await dispatch(login(user));
            console.log("resultAction: ", resultAction);
            const originalPromiseResult = unwrapResult(resultAction);
            console.log("originalPromiseResult:", originalPromiseResult);
            if (originalPromiseResult.status === 400) {
              let responseError = originalPromiseResult.response.data.message;
              message.error(responseError);
            } else {
              const resultVerify = await verifyToken(
                originalPromiseResult.token
              );
              console.log("resultVerify: ", resultVerify);
              //resultAction.payload.data là lấy ra được user
              const userResponse = resultVerify.data;
              console.log("USERRESPONSE: ", userResponse);
              message.success(`Login successfully! 
                                Welcome ${userResponse?.role} ${userResponse?.fullName}`);
              switch (userResponse?.role) {
                case ROLE_ADMIN:
                case ROLE_MANAGER:
                case ROLE_STAFF:
                  // Chuyển về dashboard
                  navigate("/admin");
                  console.log("đã vào /admin");
                  break;
                default:
                  // Chuyển về trang home
                  navigate("/home");
                  break;
              }
              // if (userResponse.role === ROLE_ADMIN) {
              //     //chuyển về dashboard
              //     navigate('/admin');
              //     console.log("đã vào /admin");

              // } else {
              //     navigate('/home');
              // }
            }
          } catch (error) {
            console.log("bắt lỗi: ");
            console.log(error);

            const responseError = error?.response?.data?.error;
            message.error(responseError || error);
          }
        },
      });
    } else if (activeTab === "signup") {
      Validator({
        form: "#form-sign-up",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
          Validator.isRequired(
            "#form-sign-up #fullName",
            "Please enter full name"
          ),
          Validator.isRequired(
            "#form-sign-up #dob",
            "Please enter date of birth"
          ),
          Validator.isValidDate("#form-sign-up #dob", "create", ""),
          Validator.isRequired(
            "#form-sign-up #phoneNumber",
            "Please enter phone number"
          ),
          Validator.isPhoneNumber(
            "#form-sign-up #phoneNumber",
            "",
            TOTAL_DIGITS_PHONE_NUMBER
          ),
          Validator.isRequired("#form-sign-up #email", "Please enter email"),
          Validator.isEmail("#form-sign-up #email"),
          Validator.isRequired(
            "#form-sign-up #password",
            "Please enter password"
          ),
          Validator.minLength("#form-sign-up #password", PASSWORD_LENGTH),
          Validator.isRequired(
            "#form-sign-up #password_confirmation",
            "Please confirm password"
          ),
          Validator.isConfirmed(
            "#form-sign-up #password_confirmation",
            function () {
              return document.querySelector("#form-sign-up #password").value;
            },
            "Passwords do not match"
          ),
        ],
        onSubmit: async (rawData) => {
          console.log("RAWDATA DOB: ", rawData.dob);

          const data = {
            fullName: rawData.fullName,
            dob: rawData.dob,
            phoneNumber: rawData.phoneNumber,
            email: rawData.email,
            password: rawData.password,
            role: "user",
          };
          console.log("data: ", data);

          try {
            const response = await register(data);
            console.log("Sign Up Response:", response);
            message.success(
              `Welcome ${response.data.fullName}, you've successfully registered!`
            );
            navigate("/login"); // Điều hướng sau khi đăng ký thành công
          } catch (error) {
            console.error("Sign Up Error:", error);
            const ErrorMessage = error?.response?.data?.message;
            message.error(ErrorMessage);
          }
        },
      });
    }
  }, [activeTab]);

  return (
    <div
      id="mooc"
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-3 card-shadow"
        style={{
          width: activeTab === "signup" ? "600px" : "370px",
          overflow: "auto",
        }}
      >
        <div id="form-tabs">
          <ul className="nav nav-tabs d-flex justify-content-between w-100">
            <li className="nav-item w-50 text-center">
              <button
                className={`btn-cus nav-link ${
                  activeTab === "signin"
                    ? "active font-weight-bold custom-active-tab"
                    : "custom-inactive-tab"
                }`}
                onClick={() => handleTabClick("signin")}
                style={{
                  fontSize: "1.5rem",
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                disabled={isPending}
              >
                Sign In
              </button>
            </li>
            <li className="nav-item w-50 text-center">
              <button
                className={`btn-cus nav-link ${
                  activeTab === "signup"
                    ? "active font-weight-bold custom-active-tab"
                    : "custom-inactive-tab"
                }`}
                onClick={() => handleTabClick("signup")}
                style={{
                  fontSize: "1.5rem",
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                disabled={isPending}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>

        <div className="tab-content mt-3">
          <div
            className={`tab-pane ${
              activeTab === "signin" ? "active show" : "fade"
            }`}
            id="tab-content-signin"
          >
            {activeTab === "signin" && <SignInForm />}
          </div>

          <div
            className={`tab-pane ${
              activeTab === "signup" ? "active show" : "fade"
            }`}
            id="tab-content-signup"
          >
            {activeTab === "signup" && <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInSignUp;
