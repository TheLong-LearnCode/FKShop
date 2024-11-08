import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Radio } from "antd";
import { getAllCategories } from "../../../service/categoryService";

const { Option } = Select;

const TagModal = ({ visible, mode, tag, onCancel, onOk }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (tag && (mode === "edit" || mode === "view")) {
      console.log(tag);

      form.setFieldsValue(tag.tag);
    } else {
      form.resetFields();
    }
  }, [tag, mode, form]);

  const handleOk = () => {
    if (mode === "view") {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      const tagData = mode==="add"
      ? {tagName: values.tagName, description: values.description}
      : {...values};
      onOk(tagData);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={
        mode === "add" ? "Add Tag" : mode === "edit" ? "Edit Tag" : "View Tag"
      }
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "view" ? "Close" : "Save"}
      cancelText={mode === "view" ? null : "Cancel"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="tagID" label="TagID" hidden={mode === "add"}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="tagName" label="Tag Name" rules={[{ required: true }]}>
          <Input disabled={mode === "view"} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea disabled={mode === "view"} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          hidden={mode === "add"}
          disabled={mode === "add"}
        >
          <Radio.Group disabled={mode === "view" || mode === "add"}>
            <Radio value={1}>Active</Radio>
            <Radio value={0}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item
          name="categoryNames"
          label="Categories"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            disabled={mode === "view"}
            placeholder="Select categories"
          >
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default TagModal;
