import React, { useState, useEffect } from "react";
import Validator from "../../Validator";
import styles from "./index.module.css";
import clsx from "clsx";
import { format } from "date-fns";
import { getUserByAccountID, updateUser } from "../../../service/userService";
import Warning from "./Warning";
import { message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { Notification } from "./Notification";
import { setUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import "../../../util/GlobalStyle/GlobalStyle.css";
import { CameraOutlined } from "@ant-design/icons";
import { uploadAvater } from "../../../service/uploadImages";

export default function UpdateAccountForm({ userInfo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const [isDateType, setIsDateType] = useState(false);
  console.log("userInfo in update account: ", userInfo);

  // Thông tin cũ của user
  const oldUserInfo = {
    fullName: userInfo?.fullName,
    email: userInfo?.email,
    phoneNumber: userInfo?.phoneNumber,
    dob: userInfo?.dob,
  };

  //const dobFormat = userInfo?.dob ? format(new Date(userInfo?.dob), 'yyyy-MM-dd') : '';

  var [fullName = userInfo?.fullName, setFullName] = useState();
  var [email = userInfo?.email, setEmail] = useState();
  var [phoneNumber = userInfo?.phoneNumber, setPhoneNumber] = useState();
  var [dob = userInfo?.dob, setDob] = useState();

  const handleDobChange = (event) => {
    setDob(event.target.value);
  };

  // Hàm so sánh các trường và hiển thị thông báo
  const compareFields = (oldData, newData, response) => {
    let changes = [];
    if (oldData.fullName !== newData.fullName) {
      changes.push(`FullName: ${oldData.fullName} -> ${newData.fullName}`);
    }
    if (oldData.dob !== newData.dob) {
      changes.push(`Date of Birth: ${oldData.dob} -> ${newData.dob}`);
    }
    if (oldData.phoneNumber !== newData.phoneNumber) {
      changes.push(
        `Phone Number: ${oldData.phoneNumber} -> ${newData.phoneNumber}`
      );
    }
    if (oldData.email !== newData.email) {
      changes.push(`Email: ${oldData.email} -> ${newData.email}`);
    }

    // Hiển thị các thay đổi nếu có
    if (changes.length > 0) {
      changes.forEach((change) => {
        Notification("Notice:", change, 6, "info");
      });
      Notification(response.message, "", 2, "success");
    } else {
      message.info("No changes were made.");
    }
  };

  useEffect(() => {
    Validator({
      form: "#form-update-account",
      formGroupSelector: ".form-group",
      errorSelector: ".form-message",
      rules: [
        Validator.updateFullName(
          "#fullName",
          () => userInfo?.fullName,
          ""
        ),
        Validator.isRequired("#fullName", "Please enter full name"),

        Validator.updateDateOfBirth("#dob", userInfo?.dob, ""),
        Validator.isValidDate("#dob", "update", ""),

        Validator.updatePhoneNumber("#phoneNumber", userInfo?.phoneNumber, ""),
        Validator.updateEmail(
          "#email",
          userInfo?.email,
          "Please enter a valid email"
        ),
      ],
      onSubmit: async (rawData) => {
        const data = {
          fullName: rawData.fullName || userInfo.fullName,
          dob: rawData.dob || userInfo.dob,
          phoneNumber: rawData.phoneNumber || userInfo.phoneNumber,
          email: rawData.email || userInfo.email,
        };

        try {
          const response = await updateUser(data, userInfo.accountID);
          compareFields(oldUserInfo, data, response); // Gọi hàm so sánh các trường sau khi cập nhật
          const updatedUserData = await getUserByAccountID(userInfo.accountID);
          // Update the Redux store with the new user data
          dispatch(setUser(updatedUserData));
          navigate("/user/information");
        } catch (error) {
          Notification("Error", error.response.data.message, 4, "error");
        }
      },
    });
  }, [userInfo]);
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

  return (
    <>
      <div className={clsx(styles.wd)}>
        <h4 className="text-center">
          <strong>Update account</strong>
        </h4>
        <Warning />
        <form id="form-update-account">
          <div className="form-group row">
            <label htmlFor="fullname" className="col-md-3 col-form-label">
              Full Name
            </label>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <span className="form-message"></span>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="dob" className="col-md-3 col-form-label">
              Date of birth
            </label>
            <div className="col-md-5">
              <input
                id="dob"
                name="dob"
                type={isDateType ? "date" : "text"} // Switch between date and text field
                className="form-control"
                value={isDateType ? dob : userInfo?.dob} // Show formatted dob or date input
                placeholder={dob || userInfo?.dob} // Use formatted date as a placeholder
                onFocus={() => setIsDateType(true)} // Switch to date input on focus
                onBlur={(e) => {
                  if (!e.target.value) {
                    setDob(dobFormat); // If value is empty, reset it to the original format
                    setIsDateType(false); // Switch back to text input on blur
                  } else {
                    setDob(dob);
                    setIsDateType(true); // Switch back to text input on
                  }
                }}
                onChange={handleDobChange} // Update dob state on change
              />
              <span className="form-message"></span>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="phone" className="col-md-3 col-form-label">
              Phone number
            </label>
            <div className="col-md-5">
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <span className="form-message"></span>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="email" className="col-md-3 col-form-label">
              Email
            </label>
            <div className="col-md-5">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="form-message"></span>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-outline-dark col-md-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
