import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../store/auth";

const Question2 = () => {
  const [questions, setQuestions] = useState([]);
  const { submitted, setSubmitted, authorization_token, newQuestionId, API } =
    useAuth();
  const [newQuestion, setNewQuestion] = useState({
    answers: [],
    sentence: "",
    preview: "",
    points: "",
  });

  // Adds a new question to the list
  const handleAddQuestion = () => {
    if (!newQuestion.sentence.trim()) return; // Prevent adding empty questions
    setQuestions([...questions, newQuestion]);
    resetNewQuestion();
  };

  // Removes a question by index
  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handles word selection for blank creation
  const handleWordClick = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      const { sentence, preview, answers } = newQuestion;
      const updatedPreview = preview.includes(selectedText)
        ? preview.replace(new RegExp(`\\b${selectedText}\\b`, "g"), "_____")
        : preview;

      setNewQuestion({
        ...newQuestion,
        preview: updatedPreview,
        answers: [...answers, selectedText],
      });
    }
  };

  // Removes a blank and restores the original word
  const handleRemoveBlank = (answer) => {
    const { preview, answers } = newQuestion;
    setNewQuestion({
      ...newQuestion,
      preview: preview.replace("_____", answer),
      answers: answers.filter((a) => a !== answer),
    });
  };

  // Updates the sentence and adjusts preview and answers accordingly
  const handleSentenceChange = (e) => {
    const newSentence = e.target.value;
    const { answers, preview } = newQuestion;
    let updatedPreview = newSentence;

    // Preserve blanks for existing answers
    answers.forEach((answer) => {
      const blankedWord = "_____";

      // If the answer exists in the preview, keep it as a blank
      if (preview.includes(blankedWord) && updatedPreview.includes(answer)) {
        updatedPreview = updatedPreview.replace(
          new RegExp(`\\b${answer}\\b`, "g"),
          blankedWord
        );
      } else if (!updatedPreview.includes(blankedWord)) {
        // Restore original word if the blank is no longer in the sentence
        updatedPreview = updatedPreview.replace(blankedWord, answer);
      }
    });

    setNewQuestion({
      ...newQuestion,
      sentence: newSentence,
      preview: updatedPreview,
      answers: answers.filter((answer) => updatedPreview.includes("_____")),
    });
  };

  // Submits question details to the API
  const submitDetails = async () => {
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/admin/createQuestion2`,
        {
          method: "PATCH",
          headers: {
            Authorization: authorization_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions, newQuestionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit details");

      // Reset after successful submission
      setQuestions([]);
      resetNewQuestion();
      setSubmitted(3);
    } catch (error) {
      console.error(error);
    }
  };

  // Handles submission based on state changes
  useEffect(() => {
    if (submitted === 2 && newQuestionId) {
      submitDetails();
    }
  }, [submitted, newQuestionId]);

  // Resets the new question form
  const resetNewQuestion = () => {
    setNewQuestion({
      answers: [],
      sentence: "",
      preview: "",
      points: "",
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">
        Question 2 - Fill in the Blanks
      </h1>

      <div className="card p-4 mb-4 shadow">
        <h3 className="mb-3">Create New Question</h3>

        <form>
          {/* Sentence Input */}
          <div className="mb-3">
            <label className="form-label">Sentence:</label>
            <textarea
              className="form-control"
              rows="3"
              value={newQuestion.sentence}
              onChange={handleSentenceChange}
              placeholder="Type your sentence here and double-click words to create blanks."
              onDoubleClick={handleWordClick}
            ></textarea>
          </div>

          {/* Preview */}
          <div className="mb-3">
            <label className="form-label">Preview:</label>
            <div className="border p-2 mb-2" style={{ whiteSpace: "pre-wrap" }}>
              {newQuestion.preview || "Preview will appear here..."}
            </div>
            <div className="mb-2">
              {newQuestion.answers.map((answer, index) => (
                <span key={index} className="badge bg-primary me-2 mb-2">
                  {answer}{" "}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger ms-1"
                    onClick={() => handleRemoveBlank(answer)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Points */}
          <div className="mb-3">
            <label className="form-label">Points:</label>
            <input
              type="number"
              className="form-control"
              value={newQuestion.points}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, points: e.target.value })
              }
            />
          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddQuestion}
          >
            Save Question
          </button>
        </form>
      </div>

      {/* Display Saved Questions */}
      <div>
        <h3 className="mb-3">Saved Questions</h3>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div className="card mb-3 shadow" key={index}>
              <div className="card-body">
                <p>
                  <strong>Sentence:</strong> {q.sentence || "N/A"}
                </p>
                <p>
                  <strong>Preview:</strong> {q.preview || "N/A"}
                </p>
                <p>
                  <strong>Answers:</strong> {q.answers.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Points:</strong> {q.points || "0"}
                </p>

                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove Question
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Question2;
