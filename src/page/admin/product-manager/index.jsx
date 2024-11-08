import React, { useState, useEffect } from "react";
import { Button, Modal, message, Image, Carousel, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  deleteImages,
  saleReport,
  getProductByType,
} from "../../../service/productService";
import "./index.css";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { getAllCategories } from "../../../service/categoryService";
import { ProductUploadImage } from "../../../service/productService";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [visibleImages, setVisibleImages] = useState([]);
  const [isImagesModalVisible, setIsImagesModalVisible] = useState(false);

  const [deletedImages, setDeletedImages] = useState([]);
  const [updatedImages, setUpdatedImages] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllProducts();
    fetchProductById(selectedProduct?.productID);
    fetchAllItems();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
      message.success("Categories fetched successfully");
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
      message.success(response.message);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };
  const fetchAllItems = async () => {
    const response = await getProductByType("item");
    setItems(response.data);
  }
  const handleTypeChange = (value) => {
    setFilterType(value);
  };

  const filteredProducts = products.filter((product) => {
    if (filterType === "all") return true;
    return product.type === filterType;
  });

  const fetchProductById = async (productId) => {
    const response = await getProductById(productId);
    setSelectedProduct(response.data);
  };

  const handleUpload = async (file) => {
    const response = await ProductUploadImage(file);
    setFileList([...fileList, response]);
    return response;
  };
  const handleDelete = async (product) => {
    console.log("selected product: ", product);

    Modal.confirm({
      title: "Confirm Delete",
      content: (
        <div
          dangerouslySetInnerHTML={{
            __html: `Are you sure you want to delete product <strong style="color: red;">${product.name}</strong>?`,
          }}
        />
      ),
      onOk: async () => {
        const response = await deleteProduct(product.productID);
        message.success(response.message);
        fetchAllProducts(); // Refresh the product list
      },
    });
  };

  const showModal = (mode, product) => {
    setModalMode(mode);
    if (mode === "add") {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(fetchProductById(product?.productID));
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleModalOk = async (values) => {
    try {
      let response;
      if (modalMode === "add") {
        response = await addProduct(values);
      } else if (modalMode === "edit") {
        console.log(selectedProduct.productID);

        response = await updateProduct(selectedProduct.productID, values);
      }
      message.success(response.message);
      fetchAllProducts(); // Refresh the product list
    } catch (error) {
      message.error("Operation failed");
    }
    setIsModalVisible(false);
  };

  const handleViewImages = (images) => {
    setVisibleImages(images);
    setIsImagesModalVisible(true);
  };

  const handleExport = async () => {
    try {
      const fileData = await saleReport();
      const blob = new Blob([fileData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "sale_report"; // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up

      URL.revokeObjectURL(downloadUrl); // Release memory
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      Notification("Failed to export Excel file", "", 4, "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Button onClick={handleExport}>
              <img
                src={"/img/icons8-microsoft-excel-96.png"}
                alt="Your Icon"
                style={{ width: 30, height: 30 }}
              />
              Sale Report
            </Button>
          </div>
          <div>
            <Select
              value={filterType}
              onChange={handleTypeChange}
              style={{ width: 200 }}
            >
              <Option value="all">All</Option>
              <Option value="kit">Kit</Option>
              <Option value="item">Item</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("add", null, categories)}
              style={{ marginBottom: "20px" }}
              className="ml-1"
            >
              Add New Product
            </Button>
          </div>
        </div>
        <ProductTable
          products={filteredProducts}
          onView={(product) => showModal("view", product)}
          onEdit={(product) => showModal("edit", product)}
          onDelete={handleDelete}
          onViewImages={handleViewImages}
        />
        <ProductModal
          visible={isModalVisible}
          mode={modalMode}
          product={selectedProduct}
          categories={categories}
          items={items}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          fileList={fileList}
          setFileList={setFileList}
          uploading={uploading}
          setUploading={setUploading}
          deletedImages={deletedImages}
          updatedImages={updatedImages}
          setDeletedImages={setDeletedImages}
          setUpdatedImages={setUpdatedImages}
        />
        <Modal
          title="All Images"
          visible={isImagesModalVisible}
          onCancel={() => setIsImagesModalVisible(false)}
          footer={null}
        >
          <Carousel autoplay>
            {visibleImages.map((image) => (
              <div key={image?.id} style={{ textAlign: "center" }}>
                <Image
                  src={image?.url}
                  alt="product image"
                  width={300}
                  height={300}
                  style={{ objectFit: "cover", alignContent: "center" }}
                  fallback="https://s3.ap-southeast-2.amazonaws.com/fkshop/Product/no-image.png"
                />
              </div>
            ))}
          </Carousel>
        </Modal>
      </div>
    </div>
  );
};

export default ProductManager;
