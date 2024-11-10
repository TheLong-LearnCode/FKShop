// ProfileSidebar.js
import React from "react";
import clsx from "clsx"; // Using clsx to handle class names
import "./index.module.css";

export default function ProfileSidebar({ activeTab, setActiveTab, userInfo }) {
  const handleOnclick = (id) => () => {
    setActiveTab(id); // Update the active tab in UserProfile component
  };

  return (
    <div className="text-center">
      <h4>
        <strong>My Profile</strong>
      </h4>
      <img
        src={userInfo?.image ? userInfo.image : "/img/user.png"} // Replace this with your avatar image path
        alt="Profile"
        className="profile-avatar"
        style={{
          height: "100px",
          width: "100px",
          borderRadius: "100%",
          objectFit: "cover",
        }}
      />
      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "information",
        })}
        onClick={handleOnclick("information")}
      >
        Information
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "purchase",
        })}
        onClick={handleOnclick("purchase")}
      >
        Purchase
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "support",
        })}
        onClick={handleOnclick("support")}
      >
        Support
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "question",
        })}
        onClick={handleOnclick("question")}
      >
        Question
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "updateAccount",
        })}
        onClick={handleOnclick("updateAccount")}
      >
        Update Account
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "changePassword",
        })}
        onClick={handleOnclick("changePassword")}
      >
        Change Password
      </button>

      <button
        className={clsx("btn btn-outline-dark w-100 mb-2", {
          active: activeTab === "myLab",
        })}
        onClick={handleOnclick("myLab")}
      >
        My Lab
      </button>
    </div>
  );
}
