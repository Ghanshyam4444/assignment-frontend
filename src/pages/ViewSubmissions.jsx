import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const { authorization_token, API } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const findSubmissions = async () => {
    const id = params.questionId;
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/api/MyQuestions/findSubmissions/${id}`,
        {
          method: "GET",
          headers: { Authorization: authorization_token },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error(error);
      alert(
        "There was an error fetching the submissions. Please try again later."
      );
    }
  };

  useEffect(() => {
    findSubmissions();
  }, [params.questionId]);

  const handleViewAnswerSheet = (answerId) => {
    navigate(`/viewAnswerSheet/${answerId}`);
  };

  const navigateToCorrectAnswer = () => {
    navigate(`/CorrectAnswer/${params.questionId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Submissions</h2>

      {/* Button for navigating to correct answers page */}
      <div className="text-end mb-3">
        <button onClick={navigateToCorrectAnswer} className="btn btn-secondary">
          Show Correct Answers
        </button>
      </div>

      {submissions.length > 0 ? (
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Answer ID</th>
              <th>Username</th>
              <th>User ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission.answerId}>
                <td>{index + 1}</td>
                <td>{submission.answerId}</td>
                <td>{submission.userName}</td>
                <td>{submission.userId}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewAnswerSheet(submission.answerId)}
                  >
                    View Answer Sheet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-warning text-center">
          No submissions available for this question.
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;
