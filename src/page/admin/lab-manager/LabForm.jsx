import React from "react";
import { Form, Input, Select, Upload, Button, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const LabForm = ({
  form,
  products,
  onFileChange,
  currentFileName,
  uploadedFile,
  mode,
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form form={form} layout="vertical" disabled={mode === "view"}>
      <Form.Item
        name="productID"
        label="Product ID"
        rules={[{ required: true }]}
      >
        <Select>
          {products.map((product) => (
            <Select.Option key={product.productID} value={product.productID}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="status" label="Status" hidden={mode === "add"}>
        <Radio.Group disabled={mode === "view"}>
          <Radio value={1}>Active</Radio>
          <Radio value={0}>Inactive</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="level" label="Level" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="easy">Easy</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="hard">Hard</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="file"
        label="PDF File"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="file"
          onChange={onFileChange}
          beforeUpload={() => false}
          fileList={uploadedFile ? [uploadedFile] : []}
        >
          <Button icon={<UploadOutlined />}>
            {mode === "edit"
              ? currentFileName
                ? "Change PDF"
                : "Upload PDF"
              : "Upload PDF"}
          </Button>
        </Upload>
      </Form.Item>
      {currentFileName && (
        <Form.Item label="Current PDF">
          <span>{currentFileName}</span>
        </Form.Item>
      )}
    </Form>
  );
};

export default LabForm;
