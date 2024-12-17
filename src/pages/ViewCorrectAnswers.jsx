import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./ViewAnswer.css";

const ViewCorrectAnswers = () => {
  const { authorization_token, API } = useAuth();
  const params = useParams();
  const [answerData, setAnswerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const findCorrectAnswerSheet = async () => {
    setIsLoading(true);
    const id = params.questionId;
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/User/findQuestionDetails/${id}`,
        {
          method: "GET",
          headers: { Authorization: authorization_token },
        }
      );
      if (!response.ok) {
        console.log("Error fetching data");
        return;
      }
      const data = await response.json();
      console.log(data);
      setAnswerData(data.question);
    } catch (error) {
      console.error("Error fetching the answer sheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    findCorrectAnswerSheet();
  }, [authorization_token, params.questionId]);

  if (!answerData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3 text-center">
              Loading correct answers, please wait...
            </p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-center mb-4 text-primary">Correct Answers</h2>

          {/* Display answer table for Question 1 */}
          {answerData.question1 && (
            <div className="mb-5">
              <h3 className="text-secondary">Question 1</h3>
              {answerData.question1.map((question, index) => (
                <div key={index} className="card mb-4 p-4 shadow-sm">
                  <p>
                    <strong>Description:</strong> {question.description}
                  </p>
                  <p>
                    <strong>Points:</strong> {question.points}
                  </p>

                  {/* Answers Table */}
                  <h4>Answers:</h4>
                  <table className="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Belongs To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.items.map((item, idx) => (
                        <tr key={idx} className="table-light">
                          <td>{idx + 1}</td>
                          <td>{item.text}</td>
                          <td>{item.belongsTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {/* Display answer table for Question 2 */}
          {answerData.question2 && (
            <div className="mb-5">
              <h3 className="text-secondary">Question 2</h3>
              {answerData.question2.map((question, index) => (
                <div key={index} className="card mb-4 p-4 shadow-sm">
                  <p>
                    <strong>Sentence:</strong> {question.sentence}
                  </p>
                  <p>
                    <strong>Preview:</strong> {question.preview}
                  </p>
                  <p>
                    <strong>Points:</strong> {question.points}
                  </p>

                  {/* Answers Table */}
                  <div className="mb-4">
                    <h4>Answers:</h4>
                    {question.answers.map((answer, idx) => (
                      <div key={idx} className="mb-2">
                        <strong>{String.fromCharCode(65 + idx)}.</strong>{" "}
                        {answer}{" "}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Display answer table for Question 3 */}
          {answerData.question3 && (
            <div className="mb-5">
              <h3 className="text-secondary">Question 3</h3>
              {answerData.question3.map((question, index) => (
                <div key={index} className="card mb-4 p-4 shadow-sm">
                  {/* Passage Number */}
                  <div className="d-flex align-items-center mb-3">
                    <span
                      className="badge bg-primary"
                      style={{
                        padding: "10px 20px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Passage {index + 1}
                    </span>
                  </div>

                  {/* Passage Text */}
                  <p>
                    <strong>Passage Text:</strong> {question.passageText}
                  </p>

                  {/* Image (if available) */}
                  {question.pic && (
                    <div>
                      <img
                        src={question.pic}
                        alt="Passage"
                        className="mt-2"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}

                  {/* Answers */}
                  <div className="answers-section">
                    <h4
                      className="mb-3 mt-4"
                      style={{ fontWeight: "600", color: "#333" }}
                    >
                      Answers:
                    </h4>
                    {question.questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="card mb-3 p-3 shadow-lg"
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#f9f9f9",
                          border: "1px solid #ddd",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px",
                        }}
                      >
                        {/* Question Label */}
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            borderRadius: "50%",
                          }}
                        >
                          Q{idx + 1}
                        </div>

                        {/* Correct Option */}
                        <div
                          className="d-flex ms-4 justify-content-center align-items-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            borderRadius: "50%",
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>

                        {/* Question Description */}
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#333",
                            marginLeft: "16px",
                            flex: 1,
                            wordWrap: "break-word",
                          }}
                        >
                          {q.questionText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewCorrectAnswers;
