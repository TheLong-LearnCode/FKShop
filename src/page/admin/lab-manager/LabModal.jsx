import React from 'react';
import { Modal } from 'antd';
import LabForm from './LabForm';

const LabModal = ({ mode, visible, onCancel, onOk, form, products, onFileChange, editingLabId, currentFileName, uploadedFile }) => {
  return (
    <Modal
      title={mode === "edit" ? "Edit Lab" : mode === "view" ? "View Lab" : "Add New Lab"}
      visible={visible}
      onOk={mode === "view" ? null : onOk} // Disable OK button in view mode
      onCancel={onCancel}
      footer={mode === "view" ? null : undefined}
    >
      <LabForm 
        form={form} 
        mode={mode}
        products={products} 
        onFileChange={onFileChange} 
        currentFileName={currentFileName}
        uploadedFile={uploadedFile}
      />
    </Modal>
  );
};

export default LabModal;
