import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Card,
} from "antd";
import {
  addImages,
  deleteImages,
  ProductUploadImage,
  updateImage,
} from "../../../service/productService";

const { Option } = Select;
const ProductModal = ({
  visible,
  mode,
  product,
  categories,
  items,
  onCancel,
  onOk,
  fileList,
  setFileList,
  uploading,
  setUploading,
  deletedImages,
  updatedImages,
  setUpdatedImages,
  setDeletedImages,
}) => {
  const [form] = Form.useForm();
  const [type, setType] = useState(product?.type || "item");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      const dimension = product?.dimension?.replace("cm", "") || "0x0x0"; // Remove 'cm' and default to "0x0x0"
      //const [length, width, height] = dimension.split("x").map(Number);
      const [length, width, height] = dimension
        .split("x")
        .map((dim) => (isNaN(dim) ? 0 : Number(dim)));

      form.setFieldsValue({
        ...product,
        dimension: {
          length: length || 0,
          width: width || 0,
          height: height || 0,
        },
        categoryID: product.categories?.map((cat) => cat.categoryID) || [],
        components:
          product.components?.map((comp) => ({
            productID: comp.componentID,
            quantity: comp.quantity,
          })) || [],
      });

      setFileList(
        product.images?.map((img) => ({
          uid: img.id,
          name: img.name,
          status: "done",
          url: img.url,
        })) || []
      );
      setType(product.type);
    } else {
      form.resetFields();
      setFileList([]);
      setType("item");
      console.log("items: ", items);
    }
    calculateTotal();
  }, [product, mode, form, setFileList]);

  const calculateTotal = () => {
    const total = form.getFieldValue("components")?.reduce((acc, comp) => {
      const selectedComponent = items.find(
        (item) => item.productID === comp.productID
      );
      return (
        acc +
        (selectedComponent ? selectedComponent.price * (comp.quantity || 1) : 0)
      );
    }, 0);
    setTotalPrice(total || 0);
  };
  const handleQuantityChange = () => {
    // Call calculateTotal whenever the quantity changes
    calculateTotal();
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const handleProductSelect = (productID) => {
    const selectedProduct = items.find((item) => item.productID === productID);
    setSelectedStock(selectedProduct ? selectedProduct.quantity : 0);
  };
  const handleOk = () => {
    if (mode === "view") {
      onCancel();
      return;
    }
    form.validateFields().then(async (values) => {
      const formData = new FormData();

      const formattedComponents =
        values.components
          ?.map((comp) => `${comp.productID}:${comp.quantity}`)
          .join(",") || "";

      // Append all form values to FormData
      Object.keys(values).forEach((key) => {
        if (key === "components") {
          formData.append("components", formattedComponents);
        } else if (key === "categoryID") {
          formData.append(key, values[key]);
        } else if (key === "dimension") {
          formData.append(
            key,
            `${values[key].length}x${values[key].width}x${values[key].height}cm`
          );
        } else if (key !== "images") {
          // Skip 'images' field since it's handled separately
          formData.append(key, values[key]);
        }
      });

      // Append images (without indices, just "images" field)
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj); // key should be 'images' for array upload
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Handle updated images if there are any
      for (const { uid, file } of updatedImages) {
        const formData = new FormData();
        formData.append("images", file); // Add new image file
        for (let [key, value] of formData.entries()) {
          console.log(key, value, typeof value);
        }
        console.log("mode: ", mode);
      }
      if (mode === "edit") {
        if (deletedImages.length > 0) {
          console.log(deletedImages);

          const imageIDs = deletedImages.join(",");
          console.log("imageIDs: ", imageIDs);
          await deleteImages({ productID: product?.productID, imageIDs });
        }
        if (updatedImages.length > 0) {
          await addImages(product?.productID, formData);
        }
        console.log("formData in addImages: ", formData);
      }

      // Log formData for debugging
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Submit the form data
      onOk(formData);
      setDeletedImages([]);
      setUpdatedImages([]);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={
        mode === "add"
          ? "* Add New Product *"
          : mode === "edit"
          ? "* Edit Product *"
          : "* View Product *"
      }
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode !== "view" ? "Save" : ""}
      cancelText={mode === "view" ? null : "Cancel"}
      width="70%"
      bodyStyle={{
        borderRadius: "8px",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
      footer={
        mode !== "view" && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              Save
            </Button>
          </div>
        )
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          {/* Section 1 */}
          <Col span={12}>
            <Card title="Product Details" bordered={false}>
              <Form.Item
                name="images"
                label="Images"
                rules={[
                  {
                    required: true,
                    validator: (_, value) =>
                      fileList.length > 0
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Please upload at least one image")
                          ),
                  },
                ]}
              >
                <ProductUploadImage
                  mode={mode}
                  fileList={fileList}
                  setFileList={setFileList}
                  uploading={uploading}
                  setUploading={setUploading}
                  productID={product?.productID}
                  setDeletedImages={setDeletedImages}
                  setUpdatedImages={setUpdatedImages}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true }]}
              >
                <Input disabled={mode === "view"} />
              </Form.Item>

              <Form.Item
                name="price"
                label={
                  <span>
                    {" "}
                    Price
                    <span style={{ color: "red" }}> (VNĐ)</span>
                  </span>
                }
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  disabled={mode === "view"}
                  className="product-details-number"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                name="discount"
                label={
                  <span>
                    Discount
                    <span style={{ color: "red" }}> (%)</span>
                  </span>
                }
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={1}
                  disabled={mode === "view"}
                  formatter={(value) => `${Math.floor(value)}`} // Làm tròn xuống thành số nguyên
                  parser={(value) =>
                    parseInt(value.replace(/\D/g, ""), 10) || 0
                  } // Chặn ký tự không phải số
                />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Stock"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  disabled={mode === "view"}
                  className="product-details-number"
                  formatter={
                    (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy cho hàng ngàn
                  }
                  parser={
                    (value) => parseInt(value.replace(/\D/g, ""), 10) || 0 // Loại bỏ ký tự không phải số và chuyển về số nguyên
                  }
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Section 4 */}
          <Col span={12}>
            <Card title="Status & Classification" bordered={false}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Radio.Group disabled={mode === "view"}>
                  <Radio value="active">Active</Radio>
                  <Radio value="inactive">Inactive</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="type"
                label="Type"
                onChange={handleTypeChange}
                value={type}
                rules={[{ required: true }]}
              >
                <Radio.Group disabled={mode === "view"}>
                  <Radio value="kit">Kit</Radio>
                  <Radio value="item">Item</Radio>
                </Radio.Group>
              </Form.Item>
              {/* {type === "kit" && (
                <Form.Item name="components" label="Items belong to kit">
                  <Form.List name="components">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Row key={key} gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "productID"]}
                                fieldKey={[fieldKey, "productID"]}
                                label="Product Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Select a product",
                                  },
                                ]}
                              >
                                <Select placeholder="Select Product">
                                  {items?.map((item) => (
                                    <Option
                                      key={item.productID}
                                      value={item.productID}
                                    >
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "quantity"]}
                                fieldKey={[fieldKey, "quantity"]}
                                label="Quantity"
                                rules={[
                                  { required: true, message: "Enter quantity" },
                                ]}
                              >
                                <InputNumber
                                  min={1}
                                  onChange={handleQuantityChange}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Button type="link" onClick={() => remove(name)}>
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            Add Items
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              )} */}
              {type === "kit" && (
                <Col>
                  <Card title="Components in Kit" bordered={false}>
                    <Form.List name="components">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }) => (
                              <Row key={key} gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "productID"]}
                                    fieldKey={[fieldKey, "productID"]}
                                    label="Product Name"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Select a product",
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder="Select Product"
                                      onChange={(value) =>
                                        handleProductSelect(value)
                                      }
                                    >
                                      {items.map((item) => (
                                        <Option
                                          key={item.productID}
                                          value={item.productID}
                                        >
                                          {item.name}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "quantity"]}
                                    fieldKey={[fieldKey, "quantity"]}
                                    label="Quantity"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter quantity",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      min={1}
                                      onChange={handleQuantityChange}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      remove(name);
                                      setSelectedStock(0);
                                      setTotalPrice(0);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              </Row>
                            )
                          )}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block>
                              Add Items
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    {/* Display selected stock outside the Select component */}
                    <p>
                      Stock Available:{" "}
                      <span style={{ color: "green" }}>
                        {selectedStock || 0}
                      </span>
                    </p>
                    <span>
                      Total Item's Price Expected:{" "}
                      <span style={{ color: "red" }}>{totalPrice} VNĐ</span>
                    </span>
                  </Card>
                </Col>
              )}

              <Form.Item
                name="categoryID"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  disabled={mode === "view"}
                  placeholder="Select categories..."
                >
                  {categories?.map((category) => (
                    <Select.Option
                      key={category.categoryID}
                      value={category.categoryID}
                    >
                      {category.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* Section 2 */}
          <Col span={12}>
            <Card title="Additional Information" bordered={false}>
              <Form.Item name="publisher" label="Publisher">
                <Input disabled={mode === "view"} />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea disabled={mode === "view"} />
              </Form.Item>
            </Card>
          </Col>
          {/* Section 3 */}
          <Col span={12}>
            <Card title="Product Specifications" bordered={false}>
              <Form.Item
                label={
                  <span>
                    Dimensions
                    <span style={{ color: "red" }}> (cm)</span>
                  </span>
                }
              >
                <Input.Group compact>
                  <Form.Item
                    name={["dimension", "length"]}
                    noStyle
                    rules={[
                      { required: true, message: "Please input the length!" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Length"
                      min={0}
                      step={0.1}
                      disabled={mode === "view"}
                    />
                  </Form.Item>
                  <span style={{ margin: "0 8px" }}>x</span>
                  <Form.Item
                    name={["dimension", "width"]}
                    noStyle
                    rules={[
                      { required: true, message: "Please input the width!" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Width"
                      min={0}
                      step={0.1}
                      disabled={mode === "view"}
                    />
                  </Form.Item>
                  <span style={{ margin: "0 8px" }}>x</span>
                  <Form.Item
                    name={["dimension", "height"]}
                    noStyle
                    rules={[
                      { required: true, message: "Please input the height!" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Height"
                      min={0}
                      step={0.1}
                      disabled={mode === "view"}
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item
                name="weight"
                label={
                  <span>
                    Weight
                    <span style={{ color: "red" }}> (kg)</span>
                  </span>
                }
              >
                <InputNumber min={0} step={0.1} disabled={mode === "view"} />
              </Form.Item>

              <Form.Item name="material" label="Material">
                <Input.TextArea disabled={mode === "view"} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductModal;
