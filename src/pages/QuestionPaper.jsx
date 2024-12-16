import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuestionPaper.css";
import QuestionPaperPart3 from "../components/QuestionPaper/QuestionPaperPart3";
import QuestionPaperPart2 from "../components/QuestionPaper/QuestionPaperPart2";

const QuestionPaper = () => {
  const {
    submitAnswer,
    setSubmitAnswer,
    authorization_token,
    newAnswerId,
    setNewAnswerId,
    API,
  } = useAuth();
  const params = useParams();
  const [questions, setQuestions] = useState({ question1: [] });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [responses, setResponses] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingOver, setDraggingOver] = useState(null);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

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

      const shuffled = data.question.question1.map((q) =>
        shuffleArray(q.items)
      );
      setQuestions(data.question);
      setShuffledAnswers(shuffled);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    findQuestionDetails();
  }, []);

  const handleDragStart = (item) => {
    setDraggingItem(item);
  };

  const handleDrop = (questionIndex, belongsTo) => {
    if (draggingItem) {
      if (responses[`${questionIndex}-${belongsTo}`]) {
        return;
      }

      setResponses((prev) => ({
        ...prev,
        [`${questionIndex}-${belongsTo}`]: draggingItem.text,
      }));

      const updatedShuffledAnswers = [...shuffledAnswers];
      updatedShuffledAnswers[questionIndex] = updatedShuffledAnswers[
        questionIndex
      ].filter((item) => item.text !== draggingItem.text);

      setShuffledAnswers(updatedShuffledAnswers);
      setDraggingItem(null);
      setDraggingOver(null);
    }
  };

  const handleDragOver = (e, belongsTo) => {
    e.preventDefault();
    setDraggingOver(belongsTo);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  const handleReturnDrag = (questionIndex, item) => {
    const updatedResponses = { ...responses };
    Object.keys(updatedResponses).forEach((key) => {
      if (updatedResponses[key] === item.text) {
        delete updatedResponses[key];
      }
    });
    setResponses(updatedResponses);

    const updatedShuffledAnswers = [...shuffledAnswers];
    updatedShuffledAnswers[questionIndex] = [
      ...updatedShuffledAnswers[questionIndex],
      { text: item.text },
    ];
    setShuffledAnswers(updatedShuffledAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = params.id;
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/User/submitResponses1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization_token,
          },
          body: JSON.stringify({ responses, id }),
        }
      );
      if (!response.ok) {
        console.error("Error submitting responses");
        return;
      }
      const data = await response.json();
      setSubmitAnswer(1);
      setNewAnswerId(data.answerId);

      const allDroppedAnswers = Object.entries(responses);
      const updatedShuffledAnswers = [...shuffledAnswers];

      allDroppedAnswers.forEach(([key, answer]) => {
        const [questionIndex, belongsTo] = key.split("-");

        const questionAnswers = updatedShuffledAnswers[parseInt(questionIndex)];

        if (!questionAnswers.find((item) => item.text === answer)) {
          updatedShuffledAnswers[parseInt(questionIndex)].push({
            text: answer,
          });
        }
      });

      setShuffledAnswers(updatedShuffledAnswers);

      setResponses({});
      setDraggingItem(null);
      setDraggingOver(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="question-paper-header text-center mb-5">
        <h1 className="question-paper-title">Question Paper</h1>
      </div>
      {questions.question1.length > 0 ? (
        <>
          <div className="card bg-white shadow-sm container mt-4">
            {/* Question1 */}
            <div className="question-paper-header text-center mb-5 mt-4">
              <h3 className="text-muted">Drag the answers into the boxes</h3>
            </div>
            {/* Answer Pool */}
            <div className="answer-pool mb-4">
              {questions.question1.map((question, qIndex) => (
                <div key={qIndex} className="mb-4">
                  <h5>Question {qIndex + 1}</h5>
                  <div className="d-flex align-items-start">
                    {shuffledAnswers[qIndex]?.map((item, index) => (
                      <div
                        key={index}
                        className="answer-item p-2 border rounded me-2 mb-2"
                        draggable
                        onDragStart={() => handleDragStart(item)}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    {/* available question part */}
                    {question.items.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        {/* BelongsTo Text */}
                        <div className="belongs-to p-2 me-3">
                          <strong>{item.belongsTo}</strong>
                        </div>

                        {/* Droppable Box */}
                        <div
                          className={`droppable-box p-2 border rounded me-3 ${
                            draggingOver === item.belongsTo
                              ? "droppable-box-hover"
                              : ""
                          } ${
                            responses[`${qIndex}-${item.belongsTo}`]
                              ? "filled"
                              : ""
                          }`}
                          onDragOver={(e) => handleDragOver(e, item.belongsTo)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(qIndex, item.belongsTo)}
                        >
                          {responses[`${qIndex}-${item.belongsTo}`] ? (
                            <div
                              className="d-flex justify-content-between"
                              draggable
                              onDragStart={() =>
                                handleReturnDrag(qIndex, {
                                  text: responses[
                                    `${qIndex}-${item.belongsTo}`
                                  ],
                                })
                              }
                            >
                              {responses[`${qIndex}-${item.belongsTo}`]}
                            </div>
                          ) : (
                            "Drop your answer here"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container my-4">
            <div className="card shadow p-4">
              <div className="text-center">
                <div className="p-font text-muted">
                  <h5>No questions related to matching question answers</h5>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Question2 */}
      <QuestionPaperPart2 />
      {/* Question3 */}
      <QuestionPaperPart3 />
      <div className="mt-5 mb-5">
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <button type="submit" className="btn btn-success btn-lg">
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default QuestionPaper;
