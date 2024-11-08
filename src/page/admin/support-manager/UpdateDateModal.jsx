import React, { useState } from "react";
import { Modal, DatePicker, Button } from "antd";

export default function UpdateDateModal({ visible, onClose, onUpdateDate }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleUpdate = () => {
    if (selectedDate) {
      onUpdateDate(selectedDate);
      onClose();  // Đóng modal sau khi cập nhật ngày
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title="Select Update Date"
    >
      <DatePicker onChange={handleDateChange} className="mr-1" />
      <Button 
        type="primary" 
        onClick={handleUpdate} 
        style={{ marginTop: "10px" }}
      >
        Update Date
      </Button>
    </Modal>
  );
}
