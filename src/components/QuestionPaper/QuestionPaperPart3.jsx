import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionPaperPart3 = () => {
  const {
    submitAnswer,
    setSubmitAnswer,
    authorization_token,
    newAnswerId,
    setNewAnswerId,
    API,
  } = useAuth();
  const params = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  // Fetch question paper details
  const findQuestionDetails = async () => {
    const id = params.id;
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/User/findQuestionDetails/${id}`,
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
      console.log("Fetched questions:", data.question.question3);

      setQuestions(data.question.question3); // Setting question3 to the state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    findQuestionDetails();
  }, []);

  // Handle option selection
  const handleSelectOption = (questionIndex, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [`${questionIndex}`]: optionIndex,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/User/submitResponses3`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization_token,
          },
          body: JSON.stringify({ responses, newAnswerId }),
        }
      );
      if (!response.ok) {
        console.error("Error submitting responses");
        return;
      }
      // Reset only the selected options (responses), not the passages or questions
      setResponses({});

      // Optionally reset other states like `submitAnswer` or `newAnswerId`
      setSubmitAnswer(0);
      setNewAnswerId("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (submitAnswer === 2 && newAnswerId) {
      handleSubmit();
    }
  }, [submitAnswer, newAnswerId]);

  return (
    <>
      {questions.length > 0 ? (
        <>
          <div className="p-font text-muted d-flex justify-content-center mt-5">
            <h2>Passages</h2>
          </div>
          <div className="container mt-3">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="card shadow-sm mb-4">
                <div className="card-body">
                  {/* Passage Number and Image or Text */}
                  <h5 className="card-title">Passage {qIndex + 1}:</h5>
                  {/* If image exists, display it */}
                  <p>{question.passageText}</p>
                  {question.pic ? (
                    <img
                      src={question.pic}
                      alt="Passage"
                      className="mt-2"
                      style={{
                        maxWidth: "100%", // Ensure image doesn't exceed container width
                        maxHeight: "300px", // Limit height to 300px
                        objectFit: "contain", // Keep aspect ratio intact
                        borderRadius: "8px", // Optional: Add some border radius
                      }}
                    />
                  ) : null}
                  {/* Questions for this passage */}
                  {question.questions.map((singleQuestion, idx) => (
                    <div key={idx}>
                      {/* Question Text */}
                      <h6 className="card-subtitle mt-4 mb-2 text-primary">
                        Question {idx + 1}:
                      </h6>
                      <p>{singleQuestion.questionText}</p>

                      {/* Options */}
                      <div>
                        {singleQuestion.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`option-item p-3 border rounded mb-2 ${
                              responses[`${qIndex}_${idx}`] === oIndex
                                ? "bg-primary text-white"
                                : "bg-light"
                            }`}
                            onClick={() =>
                              handleSelectOption(`${qIndex}_${idx}`, oIndex)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                  <h5>No questions related to the passage</h5>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionPaperPart3;
