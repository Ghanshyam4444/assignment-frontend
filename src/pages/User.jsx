import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { authorization_token, API } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const totalQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/User/getAllQuestions`,
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    totalQuestions();
  }, []);

  const handleViewPaper = (questionId) => {
    navigate(`/questionpaper/${questionId}`);
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
      )}
    </div>
  );
};

export default User;
