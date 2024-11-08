import React from 'react';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

const SupportModal = ({ isModalVisible, modalType, modalContent, handleOk, handleCancel, setModalContent }) => {
  return (
    <Modal
      title={modalType}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      style={{ top: "20%" }}
    >
      <TextArea
        rows={3}
        value={modalContent}
        onChange={(e) => setModalContent(e.target.value)}
        placeholder={`Enter your ${modalType.toLowerCase()} here...`}
      />
    </Modal>
  );
};

export default SupportModal;
