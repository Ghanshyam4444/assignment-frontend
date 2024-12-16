import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../store/auth";

const Question1 = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    categories: [""],
    items: [{ text: "", belongsTo: "" }],
    points: "",
  });
  const [validationError, setValidationError] = useState(false); // Tracks if validation fails
  const {
    submitted,
    setSubmitted,
    authorization_token,
    setNewQuestionId,
    newQuestionId,
  } = useAuth();

  const handleAddQuestion = () => {
    // Check if all required fields are filled
    if (
      !newQuestion.points ||
      !newQuestion.description ||
      newQuestion.categories.some((cat) => !cat.trim()) ||
      newQuestion.items.some((item) => !item.text.trim() || !item.belongsTo)
    ) {
      setValidationError(true); // Show error message or highlight fields
      alert("Please fill in all required fields before saving.");
      return;
    }

    setQuestions([...questions, newQuestion]); // Save the question
    setNewQuestion({
      description: "",
      categories: [""],
      items: [{ text: "", belongsTo: "" }],
      points: "",
    });
    setValidationError(false); // Reset validation error state
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...newQuestion.categories];
    updatedCategories[index] = value;
    setNewQuestion({ ...newQuestion, categories: updatedCategories });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuestion.items];
    updatedItems[index][field] = value;
    setNewQuestion({ ...newQuestion, items: updatedItems });
  };

  const submitDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/createQuestion1`,
        {
          method: "POST",
          headers: {
            Authorization: authorization_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questions),
        }
      );
      if (!response.ok) {
        console.log("Error occurred during submission");
      }
      const data = await response.json();
      setNewQuestionId(data.question._id);
      setSubmitted(2);

      // Reset all questions after submission
      setQuestions([]);
      setNewQuestion({
        description: "",
        categories: [""],
        items: [{ text: "", belongsTo: "" }],
        points: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (submitted === 1) {
      submitDetails();
    }
  }, [submitted]);

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">
        Question 1 - Category-based Questions
      </h1>
      <div className="card p-4 mb-4 shadow">
        <h3 className="mb-3">Create New Question</h3>
        <form>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className={`form-control ${
                validationError && !newQuestion.description ? "is-invalid" : ""
              }`}
              rows="2"
              value={newQuestion.description}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, description: e.target.value })
              }
              placeholder="Enter question description"
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Categories:</label>
            {newQuestion.categories.map((cat, index) => (
              <div className="input-group mb-2" key={index}>
                <input
                  type="text"
                  className={`form-control ${
                    validationError && !cat.trim() ? "is-invalid" : ""
                  }`}
                  value={cat}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder={`Category ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    setNewQuestion({
                      ...newQuestion,
                      categories: newQuestion.categories.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setNewQuestion({
                  ...newQuestion,
                  categories: [...newQuestion.categories, ""],
                })
              }
            >
              Add Category
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Items:</label>
            {newQuestion.items.map((item, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-6">
                  <input
                    type="text"
                    className={`form-control ${
                      validationError && !item.text.trim() ? "is-invalid" : ""
                    }`}
                    value={item.text}
                    onChange={(e) =>
                      handleItemChange(index, "text", e.target.value)
                    }
                    placeholder={`Item ${index + 1}`}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className={`form-select ${
                      validationError && !item.belongsTo ? "is-invalid" : ""
                    }`}
                    value={item.belongsTo}
                    onChange={(e) =>
                      handleItemChange(index, "belongsTo", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {newQuestion.categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      setNewQuestion({
                        ...newQuestion,
                        items: newQuestion.items.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setNewQuestion({
                  ...newQuestion,
                  items: [...newQuestion.items, { text: "", belongsTo: "" }],
                })
              }
            >
              Add Item
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Points:</label>
            <input
              type="number"
              className={`form-control ${
                validationError && !newQuestion.points ? "is-invalid" : ""
              }`}
              value={newQuestion.points}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, points: e.target.value })
              }
              placeholder="Enter points for this question"
              required
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

      <div>
        <h3 className="mb-3">Saved Questions</h3>
        {questions.map((q, index) => (
          <div className="card mb-3 shadow" key={index}>
            <div className="card-body">
              <p>
                <strong>Description:</strong> {q.description || "N/A"}
              </p>
              <p>
                <strong>Categories:</strong>{" "}
                {q.categories.filter(Boolean).join(", ")}
              </p>
              <p>
                <strong>Items:</strong>{" "}
                {q.items
                  .filter((item) => item.text)
                  .map((item) => `${item.text} (${item.belongsTo})`)
                  .join(", ")}
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
        ))}
      </div>
    </div>
  );
};

export default Question1;
