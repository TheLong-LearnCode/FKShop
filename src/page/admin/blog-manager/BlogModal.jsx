import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Input, Select, Radio } from "antd";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  ShowBlocks,
  SimpleUploadAdapter,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Title,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

export default function BlogModal({
  visible,
  mode,
  blog,
  tags,
  user,
  onCancel,
  onOk,
  uploadPlugin,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(true);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "sourceEditing",
        "showBlocks",
        "textPartLanguage",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "code",
        "|",
        "horizontalLine",
        "pageBreak",
        "link",
        "insertImage",
        "insertImageViaUrl",
        "mediaEmbed",
        "insertTable",
        "blockQuote",
        "codeBlock",
        "htmlEmbed",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      SelectAll,
      ShowBlocks,
      SimpleUploadAdapter,
      SourceEditing,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      Title,
      TodoList,
      Underline,
      Undo,
    ],
    extraPlugins: uploadPlugin,
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "insertImage",
      "|",
      "bulletedList",
      "numberedList",
    ],
    blockToolbar: [
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "insertImage",
      "insertTable",
      "|",
      "bulletedList",
      "numberedList",
      "outdent",
      "indent",
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData: "",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [form] = Form.useForm();
  useEffect(() => {
    console.log("blog: ", blog);
    if (blog && (mode === "edit" || mode === "view")) {
      setIsViewMode(true);
      form.setFieldsValue({
        ...blog,
        tagID: blog.tags?.map((tag) => tag.tagID) || [], // Lấy tagID của từng tag từ blog
      });
      //set riêng field content
      setContent(blog.content);
    } else {
      form.resetFields();
    }
  }, [blog, mode, form]);

  const handleOk = () => {
    if (mode === "view") {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      console.log("values", values);
      console.log("CONTENT: ", content);
      const updatedValues = {
        ...values,
        content: content,
      };

      const formData = new FormData();
      Object.keys(updatedValues).forEach((key) => {
        if (key === "toDelete") {
          // if (mode === "add") {
          //   formData.append(key, 1);
          // } else {
            formData.append(key, Number(updatedValues[key]));
          // }
        } else {
          if (key !== "blogID") {
            formData.append(key, updatedValues[key]);
          }
        }
      });
      formData.append("accountID", user.accountID);
      for (let [key, value] of formData.entries()) {
        console.log(key, value, typeof value);
      }
      onOk(formData);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={
        mode === "add"
          ? "Add Blog"
          : mode === "edit"
          ? "Edit Blog"
          : "View Blog"
      }
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "view" ? null : "Save"}
      cancelText={mode === "view" ? null : "Cancel"}
      width={"70%"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="blogID" label="Blog ID" hidden={mode === "add"}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="blogName"
          label="Blog Name"
          rules={[{ required: true }]}
        >
          <Input disabled={mode === "view"} />
        </Form.Item>
        <Form.Item name="content" label="Content">
          <div className="editor-container">
            {isLayoutReady && (
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                  if (mode !== "view") {
                    const data = editor.getData();
                    setContent(data);
                  }
                }}
                config={editorConfig}
                ref={editorRef}
                extraPlugins={uploadPlugin}
                disabled={mode === "view"}
                rules={[{ required: true }]}
              />
            )}
          </div>
        </Form.Item>
        <Form.Item name="tagID" label="Select Tags">
          <Select disabled={mode === "view"} mode="multiple">
            {tags?.map((tag) => (
              <Select.Option key={tag.tagID} value={tag.tagID}>
                {tag.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Radio.Group disabled={mode === "view"}>
            <Radio value="draft">Draft</Radio>
            <Radio value="published">Published</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="toDelete"
          label="Availability"
          rules={mode !== "add" ? [{ required: true }] : []}
          hidden={mode === "add"}
        >
          <Radio.Group disabled={mode === "view"}>
            <Radio value={1}>Yes</Radio>
            <Radio value={0}>No</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
