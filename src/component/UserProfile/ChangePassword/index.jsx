import React, { useEffect } from "react";
// import clsx from 'clsx';
import styles from "./index.module.css";
import Validator from "../../Validator"; // Ensure this import points to the correct path
import { PASSWORD_LENGTH } from "../../../constants/fomConstrant";
import { updatePassword } from "../../../service/userService";
import { Notification } from "../UpdateAccount/Notification";

export default function ChangePassword({ userInfo }) {
  console.log("userInfo in ChangePassword: ", userInfo);
  useEffect(() => {
    Validator({
      form: "#form-change-password",
      formGroupSelector: ".form-group",
      errorSelector: ".form-message",
      rules: [
        Validator.minLength(
          "#form-change-password #currentPassword",
          PASSWORD_LENGTH,
          ""
        ),
        Validator.minLength(
          "#form-change-password #newPassword",
          PASSWORD_LENGTH,
          ""
        ),
        Validator.isConfirmed(
          "#form-change-password #password_confirmation",
          function () {
            return document.querySelector("#form-change-password #newPassword")
              .value;
          },
          "Passwords do not match"
        ),
      ],
      onSubmit: async (rawData) => {
        const updatedPassword = {
          currentPassword: rawData.currentPassword,
          newPassword: rawData.newPassword,
        };
        console.log("updatedPassword: ", updatedPassword);
        try {
          const response = await updatePassword(userInfo.accountID, updatedPassword);
          console.log("response in updatePassword: ", response);
          Notification(response.message, "", 2, "info");
        } catch (error) {
          console.error("Error in updatePassword: ", error);
          Notification(error.response.data.message, "", 2, "error");
        }
      },
    });
  }, []);

  return (
    <div className={`${styles.ht} ${styles.wd}`}>
      <form id="form-change-password">
        <div className="form-group row align-items-center">
          {" "}
          {/* Add align-items-center class here */}
          <label className="col-md-3 col-form-label" htmlFor="currentPassword">
            <strong>Current Password</strong>
          </label>
          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter your current password"
            />
            <span className="form-message"></span>
          </div>
        </div>
        <div className="form-group row align-items-center">
          {" "}
          {/* Add align-items-center class here */}
          <label className="col-md-3 col-form-label" htmlFor="newPassword">
            <strong>New Password</strong>
          </label>
          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
            />
            <span className="form-message"></span>
          </div>
        </div>
        <div className="form-group row align-items-center">
          {" "}
          {/* Add align-items-center class here */}
          <label
            className="col-md-3 col-form-label"
            htmlFor="password_confirmation"
          >
            <strong>Confirm Password</strong>
          </label>
          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Confirm your new password"
            />
            <span className="form-message"></span>
          </div>
        </div>
        <div className={`${styles.btnCustom}`}>
          <button
            type="submit"
            className="btn btn-outline-success btn-custom col-md-3"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
