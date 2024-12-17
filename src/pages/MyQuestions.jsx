import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const { authorization_token, API } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/MyQuestions/findMyQuestions`,
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleViewSubmissions = (questionId) => {
    navigate(`/viewSubmission/${questionId}`);
  };

  return (
    <div>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3 text-center">Loading, please wait...</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MyQuestions;
