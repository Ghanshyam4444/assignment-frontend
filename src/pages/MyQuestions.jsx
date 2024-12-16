import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const { authorization_token } = useAuth();
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/MyQuestions/findMyQuestions",
        {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questionIds || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleViewSubmissions = (questionId) => {
    navigate(`/viewSubmission/${questionId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary font-weight-bold">
        My Questions
      </h1>

      {/* Table for displaying questions */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Question ID</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((id, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{id}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewSubmissions(id)}
                    >
                      View Submissions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyQuestions;
