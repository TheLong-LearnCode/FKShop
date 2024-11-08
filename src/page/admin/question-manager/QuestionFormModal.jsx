import React, { useEffect } from "react";
import { Modal, Form, Input, Radio } from "antd";

export default function QuestionFormModal({
  mode,
  showModal,
  handleCloseModal,
  selectedQuestion,
  onOk,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedQuestion && (mode === "edit" || mode === "view")) {
      form.setFieldsValue(selectedQuestion);
    } else {
      form.resetFields();
    }
  }, [selectedQuestion, mode, form]);

  const handleOk = () => {
    if (mode === "view") {
      handleCloseModal();
      return;
    }
    form.validateFields().then((values) => {
      // const data = {
      //   questionID: values.questionID,
      //   labName: values.labName,
      //   customerName: values.customerName,
      //   description: values.description,
      //   response: values.response,
      //   status: values.status,
      // };
      onOk(values); // Pass form values to the parent component's function (onOk)
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={showModal}
      title={mode === "view" ? "View Question" : "Response Question"}
      onCancel={handleCloseModal}
      onOk={handleOk}
      okText={mode === "view" ? "Close" : "Submit"}
      cancelText={mode === "view" ? null : "Cancel"}
      width="60%"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="questionID"
          label="Question ID"
          hidden={mode === "add"}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item name="labName" label="Lab Name">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="customerName" label="Customer Name">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea disabled={true} />
        </Form.Item>
        <Form.Item
          name="response"
          label="Response"
          rules={[{ required: true, message: "Response is required" }]}
        >
          <Input.TextArea placeholder="Enter your response" disabled={mode === "view"}/>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Radio.Group disabled={mode !== "edit"}>
            <Radio value={1}>Answered</Radio>
            <Radio value={0}>Not yet</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
