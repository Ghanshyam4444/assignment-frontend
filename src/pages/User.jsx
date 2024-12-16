import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { authorization_token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const totalQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/User/getAllQuestions",
        {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        }
      );
      if (!response.ok) {
        console.log("Error fetching questions");
        return;
      }
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    totalQuestions();
  }, []);

  const handleViewPaper = (questionId) => {
    navigate(`/questionpaper/${questionId}`);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Question Papers List</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Paper Number</th>
            <th scope="col">Question Paper ID</th>
            <th scope="col">Creator's Name</th>
            <th scope="col">View Paper</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.questionId}>
              <td>{index + 1}</td>
              <td>{question.questionId}</td>
              <td>{question.createdByName}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewPaper(question.questionId)}
                >
                  View Paper
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
