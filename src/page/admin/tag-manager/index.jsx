import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TagTable from "./TagTable";
import TagModal from "./TagModal";
import { createTag, deleteTag, getAllTags, updateTag } from "../../../service/tagService";
import "./index.css";
const { Search } = Input;

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTag, setSelectedTag] = useState(null);

  const fetchAllTags = async () => {
    const response = await getAllTags();
    setTags(response);
  };

  const fetchTagById = async () => {
    if (selectedTag) {
      const response = await fetchTagById(selectedTag.tagID);
      setSelectedTag(response);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, []);

  const showModal = (mode, tag = null) => {
    setModalMode(mode);
    setSelectedTag(tag);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTag(null);
  };

  const handleModalOk = async (values) => {
    if (modalMode === "add") {
      const response = await createTag(values);
      message.success(response.message);
    } else if (modalMode === "edit") {
      console.log(values);

      const response = await updateTag(selectedTag.tag.tagID, values);
      setTags(
        tags.map((tag) =>
          tag.tagID === selectedTag.tagID ? { ...tag, ...values } : tag
        )
      );
      message.success(response.message);
    }
    fetchAllTags();
    setIsModalVisible(false);
  };

  const handleDelete = (tag) => {
    Modal.confirm({
      title: "Are you sure you want to delete this tag?",
      content: "This action cannot be undone.",
      onOk: async () => {
        const response = await deleteTag(tag.tag.tagID);
        fetchAllTags();
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
          <strong>Tags</strong>
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
      <TagTable
        tags={tags}
        onView={(tag) => showModal("view", tag)}
        onEdit={(tag) => showModal("edit", tag)}
        onDelete={handleDelete}
      />
      <TagModal
        visible={isModalVisible}
        mode={modalMode}
        tag={selectedTag}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default TagManager;
