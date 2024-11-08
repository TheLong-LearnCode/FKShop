import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../../service/categoryService";
import { getAllTags } from "../../../service/tagService";
import { getAllProducts } from "../../../service/productService";

const { Search } = Input;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tags, setTags] = useState(null);
  const [products, setProducts] = useState(null);
  const fetchAllCategories = async () => {
    const response = await getAllCategories();
    setCategories(response);
  };
  const fetchAllTags = async () => {
    const response = await getAllTags();
    setTags(response);
  };
  const fetchAllProducts = async () => {
    const response = await getAllProducts();
    setProducts(response.data);
  };
  useEffect(() => {
    fetchAllTags();
    fetchAllCategories();
    fetchAllProducts();
  }, []);

  const showModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

  const handleModalOk = async (values) => {
    if (modalMode === "add") {
      const response = await createCategory(values);
      // const newCategory = { ...values, categoryID: Date.now() };
      // setCategories([...categories, newCategory]);
      message.success(response.message);
    } else if (modalMode === "edit") {
      const response = await updateCategory(
        selectedCategory.categoryID,
        values
      );
      setCategories(
        categories.map((cat) =>
          cat.categoryID === selectedCategory.categoryID
            ? { ...cat, ...values }
            : cat
        )
      );
      message.success(response.message);
    }
    fetchAllCategories();
    setIsModalVisible(false);
  };

  const handleDelete = (category) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: (
        <div
        dangerouslySetInnerHTML={{
          __html: `Are you sure you want to delete category <strong style="color: red;">${selectedCategory.categoryName}</strong>?`,
        }}
        />
      ),
      onOk: async() => {
        const response = await deleteCategory(category.categoryID);
        //setCategories(categories.filter(cat => cat.categoryID !== category.categoryID));
        fetchAllCategories();
        message.success(response.message);
      },
    });
  };

  return (
    <div className="container mt-4">
      <div className="row center mb-3">
        <div className="col-md-6">
          <Search
            placeholder="Search"
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="d-flex align-center mb-3">
        <h2>
          <strong>Category</strong>
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
      <CategoryTable
        categories={categories}
        onView={(category) => showModal("view", category)}
        onEdit={(category) => showModal("edit", category)}
        onDelete={handleDelete}
      />
      <CategoryModal
        visible={isModalVisible}
        mode={modalMode}
        tags={tags}
        products={products}
        category={selectedCategory}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default CategoryManager;
