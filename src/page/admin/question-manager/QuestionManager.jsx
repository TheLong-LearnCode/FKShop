import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import QuestionTable from "./QuestionTable";
import QuestionFormModal from "./QuestionFormModal";
import { Notification } from "../../../component/UserProfile/UpdateAccount/Notification";
import {
  getAllQuestions,
  updateResponse,
  getQuestionByID,
  deleteQuestion,
} from "../../../service/questionService";
import "./index.css";
import { message } from "antd";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState("list");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const questionsPerPage = 5;

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const response = await getAllQuestions();
      setQuestions(response);
    } catch (error) {
      console.error("Error fetching questions:", error);
      Notification("Error fetching questions", "", 4, "error");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
  };

  const handleResponse = async (question) => {
    console.log("Question: ", question);
    const data = {
      labID: selectedQuestion.labID,
      accountID: selectedQuestion.accountID,
      description: question.description,
      response: question.response,
    };
    console.log("DATA: ", data);
    
    try {
      const response = await updateResponse(question.questionID, data);
      Notification(response.message, "", 4, "success");
      fetchAllQuestions();
      setShowModal(false);
    } catch (error) {
      console.log("Error updating question status:", error);
      Notification("Error updating question status", "", 4, "warning");
    }
  };

  const handleShowModal = async (mode, question = null) => {
    try {
      const response = await getQuestionByID(question.questionID);
      setSelectedQuestion(response.data);
      setMode(mode);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching question details:", error);
      Notification("Error fetching question details", "", 4, "error");
    }
  };

  const handleDelete = async (question) => {
    try {
      // Implement the actual API call here
      const response = await deleteQuestion(question.questionID);
      fetchAllQuestions();
      Notification(response.message, "", 4, "success");
    } catch (error) {
      console.error("Error deleting question:", error);
      Notification("Error deleting question", "", 4, "warning");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container fluid>
      <h2 className="my-4">
        <strong>Questions:</strong>
      </h2>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end"></Col>
      </Row>

      <QuestionTable
        questions={questions}
        currentPage={currentPage}
        questionsPerPage={questionsPerPage}
        //onView={(category) => showModal("view", category)}
        handleView={question => handleShowModal("view", question)}
        handleResponse={question => handleShowModal("edit", question)}
        handleDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      <QuestionFormModal
        mode={mode}
        selectedQuestion={selectedQuestion}
        showModal={showModal}
        handleShowModal={handleShowModal}
        handleCloseModal={handleCloseModal}
        onOk={handleResponse}
      />
    </Container>
  );
}
