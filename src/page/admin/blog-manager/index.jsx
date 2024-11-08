import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BlogTable from "./BlogTable";
import BlogModal from "./BlogModal";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "../../../service/blogService";
import { getAllTags } from "../../../service/tagService";
import { useDispatch, useSelector } from "react-redux";
import { IDLE } from "../../../redux/constants/status";
import { verifyToken } from "../../../service/authUser";
import "./index.css";
import { uploadImage } from "../../../service/labGuideService";
import { getUserByAccountID } from "../../../service/userService";
const { Search } = Input;

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogDataTable, setBlogDataTable] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);

  const [userInfo, setUserInfo] = useState(null); // Lưu trữ thông tin người dùng sau khi verify token
  // Lấy thông tin người dùng từ Redux Store
  const user = useSelector((state) => state.auth);
  var userToken;
  var userData;
  useEffect(() => {
    if (user.data !== null) {
      userToken = user.data?.token;
    }
    if (user.status === IDLE && user.data !== null) {
      userToken = user.data;
    }

    const fetchUserInfo = async () => {
      try {
        userData = await verifyToken(userToken); // Gọi hàm verifyToken để lấy dữ liệu
        setUserInfo(userData); // Lưu thông tin user vào state
        //userData.data -> lấy ra userInfo
      } catch (error) {
        console.error("Error verifying token: ", error);
      }
    };
    fetchUserInfo(); // Gọi API lấy thông tin người dùng
  }, [user.data]); //user.data là thông tin người dùng
  //--------------------------------------------------------------------------
  console.log("userInfo: ", userInfo?.data); //->.accountID
  //lần đầu & sau khi load lại trang: thông tin user -> userInfo?.data

  // const fetchAllBlogs = async () => {
  //   const response = await getAllBlogs();
  //   const flattenedBlogs = response.map(async(item) => ({
  //     ...item.blog,
  //     tags: item.tags,
  //     authorName: (await getUserByAccountID(item.accountID)).data?.fullName,
  //   }));
  //   setBlogs(flattenedBlogs);
  // };
  const fetchAllBlogs = async () => {
    try {
      const response = await getAllBlogs();
      const flattenedBlogs = await Promise.all(
        response.map(async (item) => {
          const authorResponse = await getUserByAccountID(item.blog.accountID);
          return {
            ...item.blog,
            tags: item.tags,
            authorName: authorResponse.data?.fullName,
          };
        })
      );
      console.log("Flattened Blogs: ", flattenedBlogs);

      setBlogs(flattenedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchAllTags = async () => {
    const response = await getAllTags();
    const tagList = response.flatMap((item) => item.tag);
    console.log("tagList: ", tagList);

    setTags(tagList);
  };

  useEffect(() => {
    fetchAllBlogs();
    fetchAllTags();
  }, []);

  const showModal = (mode, blog = null) => {
    setModalMode(mode);
    if (mode === "add") {
      setSelectedBlog(null);
    } else {
      setSelectedBlog(blog);
      console.log("selectedBlog: ", selectedBlog);
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsViewMode(false);
    setIsModalVisible(false);
    setSelectedBlog(null);
  };

  const handleModalOk = async (values) => {
    if (modalMode === "add") {
      const response = await createBlog(values);
      message.success(response.message);
    } else if (modalMode === "edit") {
      console.log("VALUES:", values);

      const response = await updateBlog(selectedBlog.blogID, values);
      setBlogs(
        blogs.map((blog) =>
          blog.blogID === selectedBlog.blogID ? { ...blog, ...values } : blog
        )
      );
      message.success(response.message);
    }
    fetchAllBlogs();
    setIsModalVisible(false);
  };

  const handleDelete = (blog) => {
    console.log("blog: ", blog);
    Modal.confirm({
      title: "Confirm Delete",
      content: (
        <div
          dangerouslySetInnerHTML={{
            __html: `Are you sure you want to delete product <strong style="color: red;">${blog.blogName}</strong>?`,
          }}
        />
      ),
      onOk: async () => {
        const response = await deleteBlog(blog.blogID);
        message.success(response.message);
        fetchAllBlogs();
      },
    });
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            try {
              const imageUrl = await uploadImage(file);
              resolve({ default: imageUrl }); // Use the uploaded image URL
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-center mb-3">
        <h2>
          <strong>Blogs</strong>
        </h2>
        <Button
          className="ml-auto"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal("add")}
        >
          Add New
        </Button>
      </div>
      <BlogTable
        blogs={blogs}
        user={userInfo?.data}
        onView={(blog) => showModal("view", blog)}
        onEdit={(blog) => showModal("edit", blog)}
        onDelete={handleDelete}
      />
      <BlogModal
        visible={isModalVisible}
        isViewMode={isViewMode}
        mode={modalMode}
        blog={selectedBlog}
        tags={tags}
        user={userInfo?.data}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        uploadPlugin={uploadPlugin}
      />
    </div>
  );
};

export default BlogManager;
