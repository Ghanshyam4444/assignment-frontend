import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionPaperPart2 = () => {
  const {
    submitAnswer,
    setSubmitAnswer,
    authorization_token,
    newAnswerId,
    setNewAnswerId,
    API,
  } = useAuth();
  const params = useParams();
  const [questions, setQuestions] = useState({ question2: [] });
  const [responses, setResponses] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);

  // Fetch question paper details
  const findQuestionDetails = async () => {
    const id = params.id;
    try {
      const response = await fetch(
        `${API}/api/User/findQuestionDetails/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching question paper details");
        return;
      }
      const data = await response.json();
      console.log(data);
      setQuestions(data.question);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    findQuestionDetails();
  }, []);

  // Handle drag start
  const handleDragStart = (answer) => {
    setDraggingItem(answer);
  };

  // Handle drop
  const handleDrop = (questionIndex, blankIndex) => {
    if (draggingItem) {
      setResponses((prev) => ({
        ...prev,
        [`${questionIndex}-${blankIndex}`]: draggingItem,
      }));
      setDraggingItem(null);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle form submission
  const handleSubmit = async () => {
    const id = params.id;
    try {
      const response = await fetch(`${API}/api/User/submitResponses2`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization_token,
        },
        body: JSON.stringify({ responses, newAnswerId, id }),
      });
      if (!response.ok) {
        console.error("Error submitting responses");
        return;
      }

      // Resetting state variables after successful submission
      setResponses({});
      setDraggingItem(null); // Reset dragging item state
      setSubmitAnswer(2);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (submitAnswer === 1 && newAnswerId) {
      handleSubmit();
    }
  }, [submitAnswer, newAnswerId]);

  return (
    <>
      {questions.question2.length > 0 ? (
        <>
          <div className="p-font text-muted d-flex justify-content-center mt-5">
            <h2>Fill in the blanks</h2>
          </div>
          <div className="card shadow-sm container mt-3 bg-white">
            {questions.question2.map((question, qIndex) => (
              <div key={qIndex} className="mb-4">
                <div className="card-body">
                  {/* Preview Text with Droppable Blanks */}
                  <div className="preview-text">
                    <h5 className="card-subtitle mb-3">
                      Question {qIndex + 1}
                    </h5>
                    {/* Answer Pool */}
                    <div className="mb-4">
                      <div className="d-flex flex-wrap">
                        {question.answers.map((answer, aIndex) => (
                          <div
                            key={aIndex}
                            className="answer-item p-2 border rounded me-3 mb-2 bg-primary text-white"
                            draggable
                            onDragStart={() => handleDragStart(answer)}
                            style={{ cursor: "grab" }}
                          >
                            {answer}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p>
                      {question.preview
                        .split("_____")
                        .map((text, blankIndex) => (
                          <span key={blankIndex}>
                            {text}
                            {blankIndex <
                              question.preview.split("_____").length - 1 && (
                              <span
                                className="droppable-box p-2 border rounded mx-2 bg-light"
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(qIndex, blankIndex)}
                                style={{
                                  display: "inline-block",
                                  minWidth: "150px",
                                  textAlign: "center",
                                }}
                              >
                                {responses[`${qIndex}-${blankIndex}`] ||
                                  "Drop your answer here"}
                              </span>
                            )}
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="container my-4">
            <div className="card shadow p-4">
              <div className="text-center">
                <div className="p-font text-muted">
                  <h5>No questions related to fill in the blanks</h5>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionPaperPart2;
