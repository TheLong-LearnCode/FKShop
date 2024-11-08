import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Radio } from "antd";
import "./index.css";
const { Option } = Select;

const CategoryModal = ({
  visible,
  mode,
  tags,
  products,
  category,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category && (mode === "edit" || mode === "view")) {
      console.log("category:", category);

      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  }, [category, mode, form]);

  const handleOk = () => {
    if (mode === "view") {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      console.log(values);
      const categoryData =
        mode === "add"
          ? {
              tagID: values.tagID,
              categoryName: values.categoryName,
              description: values.description,
            }
          : { ...values };
      onOk(categoryData);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={
        mode === "add"
          ? "Add Category"
          : mode === "edit"
          ? "Edit Category"
          : "View Category"
      }
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "view" ? "Close" : "Save"}
      cancelText={mode === "view" ? null : "Cancel"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="categoryID" label="CategoryID" hidden={mode === "add"}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="tagID" label="Select Tag" rules={[{ required: true }]}>
          <Select disabled={mode === "view"}>
            {tags?.map((tags) => (
              <Select.Option key={tags.tag.tagID} value={tags.tag.tagID}>
                {tags.tag.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="categoryName"
          label="Category Name"
          rules={[{ required: true }]}
        >
          <Input disabled={mode === "view"} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea disabled={mode === "view"} />
        </Form.Item>
        <Form.Item name="status" label="Status" hidden={mode === "add"}>
          <Radio.Group disabled={mode === "view"}>
            <Radio value={1}>Active</Radio>
            <Radio value={0}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
