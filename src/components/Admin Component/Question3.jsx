import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";

const Question3 = () => {
  const [passages, setPassages] = useState([]); // Stores all passages and their questions
  const {
    submitted,
    setSubmitted,
    authorization_token,
    newQuestionId,
    setNewQuestionId,
    API,
  } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [pic, setPic] = useState("");

  const handleAddPassage = () => {
    setPassages([
      ...passages,
      {
        passageText: "",
        pic: "", // Initialize pic as empty
        questions: [
          {
            questionText: "",
            options: ["", "", "", ""],
            correctOption: null, // Index of the correct option
          },
        ],
      },
    ]);
  };

  const handleAddQuestion = (passageIndex) => {
    const updatedPassages = [...passages];
    updatedPassages[passageIndex].questions.push({
      questionText: "",
      options: ["", "", "", ""],
      correctOption: null,
    });
    setPassages(updatedPassages);
  };

  const handlePassageChange = (index, value) => {
    const updatedPassages = [...passages];
    updatedPassages[index].passageText = value;
    setPassages(updatedPassages);
  };

  const handleQuestionChange = (passageIndex, questionIndex, value) => {
    const updatedPassages = [...passages];
    updatedPassages[passageIndex].questions[questionIndex].questionText = value;
    setPassages(updatedPassages);
  };

  const handleOptionChange = (
    passageIndex,
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedPassages = [...passages];
    updatedPassages[passageIndex].questions[questionIndex].options[
      optionIndex
    ] = value;
    setPassages(updatedPassages);
  };

  const handleSetCorrectOption = (passageIndex, questionIndex, optionIndex) => {
    const updatedPassages = [...passages];
    updatedPassages[passageIndex].questions[questionIndex].correctOption =
      optionIndex;
    setPassages(updatedPassages);
  };

  const handleRemoveQuestion = (passageIndex, questionIndex) => {
    const updatedPassages = [...passages];
    updatedPassages[passageIndex].questions.splice(questionIndex, 1); // Remove the question
    setPassages(updatedPassages);
  };

  const handleRemovePassage = (passageIndex) => {
    const updatedPassages = [...passages];
    updatedPassages.splice(passageIndex, 1); // Remove the passage
    setPassages(updatedPassages);
  };

  const submitDetails = async () => {
    // Validation
    for (const [passageIndex, passage] of passages.entries()) {
      if (!passage.passageText.trim()) {
        alert(`Passage ${passageIndex + 1} text is required.`);
        return;
      }

      for (const [questionIndex, question] of passage.questions.entries()) {
        if (!question.questionText.trim()) {
          alert(
            `Question ${questionIndex + 1} details in Passage ${
              passageIndex + 1
            } is required.`
          );
          return;
        }

        for (const [optionIndex, option] of question.options.entries()) {
          if (!option.trim()) {
            alert(
              `Option ${optionIndex + 1} for Question ${
                questionIndex + 1
              } in Passage ${passageIndex + 1} is required.`
            );
            return;
          }
        }

        if (question.correctOption === null) {
          alert(
            `Please set a correct answer for Question ${
              questionIndex + 1
            } in Passage ${passageIndex + 1}.`
          );
          return;
        }
      }
    }

    try {
      // console.log("newp", passages);
      // console.log("idQ", newQuestionId);
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/admin/createQuestion3`,
        {
          method: "PATCH",
          headers: {
            Authorization: authorization_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newQuestionId, passages }),
        }
      );

      if (!response.ok) {
        console.log("error");
      } else {
        setPassages([]);
        setUploading(false);
        setPic("");
        setSubmitted(0);
        setNewQuestionId("");
        alert("question added succesfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const postDetails = (pics, passageIndex) => {
    if (!pics.type.startsWith("image/")) {
      console.log("Please upload only image files");
      return;
    }
    setUploading(true);
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", "dgw3qbcre");
    fetch("https://api.cloudinary.com/v1_1/dgw3qbcre/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedPassages = [...passages];
        updatedPassages[passageIndex].pic = data.url; // Save the image URL for the passage
        setPassages(updatedPassages);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  useEffect(() => {
    if (submitted === 3 && newQuestionId !== "") {
      submitDetails();
      setSubmitted(0);
      setNewQuestionId("");
    }
  }, [submitted, newQuestionId]);

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">
        Question 3 - Passages and Questions
      </h1>

      {passages.map((passage, passageIndex) => (
        <div key={passageIndex} className="card mb-4 p-3 shadow">
          <div className="mb-3">
            <label className="form-label">Passage {passageIndex + 1}:</label>
            <textarea
              className="form-control"
              rows="4"
              value={passage.passageText}
              onChange={(e) =>
                handlePassageChange(passageIndex, e.target.value)
              }
              placeholder="Enter the passage text here..."
            ></textarea>
          </div>

          {/* Image upload field */}
          <div className="mb-3">
            <label className="form-label">Upload Image for Passage:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => postDetails(e.target.files[0], passageIndex)}
              required
            />
            {uploading && <p>Uploading...</p>}
            {passage.pic && (
              <img
                src={passage.pic}
                alt="Passage"
                className="mt-2"
                style={{
                  maxWidth: "100%", // Ensure image doesn't exceed container width
                  maxHeight: "300px", // Limit height to 300px
                  objectFit: "contain", // Keep aspect ratio intact
                  borderRadius: "8px", // Optional: Add some border radius
                }}
              />
            )}
          </div>

          <h5>Questions:</h5>
          {passage.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4">
              <label className="form-label">
                Question {questionIndex + 1}:
              </label>
              <input
                type="text"
                className="form-control mb-2"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(
                    passageIndex,
                    questionIndex,
                    e.target.value
                  )
                }
                placeholder="Enter the question text here..."
                required
              />

              <label>Options:</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        passageIndex,
                        questionIndex,
                        optionIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className={`btn btn-${
                      question.correctOption === optionIndex
                        ? "success"
                        : "secondary"
                    }`}
                    onClick={() =>
                      handleSetCorrectOption(
                        passageIndex,
                        questionIndex,
                        optionIndex
                      )
                    }
                  >
                    {question.correctOption === optionIndex
                      ? "Correct"
                      : "Set Correct"}
                  </button>
                </div>
              ))}

              {/* Button to remove a question */}
              <button
                className="btn btn-danger mt-2"
                onClick={() =>
                  handleRemoveQuestion(passageIndex, questionIndex)
                }
              >
                Remove Question
              </button>
            </div>
          ))}

          {/* Button to add a new question to the current passage */}
          <button
            className="btn btn-secondary"
            onClick={() => handleAddQuestion(passageIndex)}
          >
            Add Question
          </button>

          {/* Button to remove the passage */}
          <button
            className="btn btn-danger mt-2"
            onClick={() => handleRemovePassage(passageIndex)}
          >
            Remove Passage
          </button>
        </div>
      ))}

      {/* Button to add a new passage at the bottom */}
      <button className="btn btn-primary mb-4" onClick={handleAddPassage}>
        Add Passage
      </button>
    </div>
  );
};

export default Question3;
