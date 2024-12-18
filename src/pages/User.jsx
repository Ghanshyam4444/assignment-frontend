import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { authorization_token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Questions
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://assignment-backend-eight-self.vercel.app/api/User/getAllQuestions",
        {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching questions");
        return;
      }
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Navigate to Question Paper
  const handleViewPaper = (questionId) => {
    navigate(`/questionpaper/${questionId}`);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3 text-center">Loading, please wait...</p>
          </div>
        </div>
      ) : (
        <div className="container my-4">
          <h2 className="text-center mb-4">Question Papers List</h2>
          <div className="table-responsive">
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
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <tr key={question.questionId}>
                      <td>{index + 1}</td>
                      <td>{question.questionId}</td>
                      <td>{question.createdByName || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewPaper(question.questionId)}
                        >
                          View Paper
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Questions Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
