/////////////////////////////////////////////////////////////// user interface 1///////////////////////////////////

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./ViewAnswer.css";

const ViewAnswers = () => {
  const { authorization_token, API } = useAuth();
  const params = useParams();
  const [answerData, setAnswerData] = useState(null);

  // Fetch the answer sheet from the backend
  const findAnswerSheet = async () => {
    const id = params.answerId;
    try {
      const response = await fetch(
        `${API}/api/MyQuestions/findAnswerSheet/${id}`,
        {
          method: "GET",
          headers: { Authorization: authorization_token },
        }
      );
      if (!response.ok) {
        console.log("Error fetching data");
        return;
      }
      const data = await response.json();
      setAnswerData(data);
    } catch (error) {
      console.error("Error fetching the answer sheet:", error);
    }
  };

  useEffect(() => {
    findAnswerSheet();
  }, [authorization_token, params.answerId]);

  // Check if the data is available before rendering
  if (!answerData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="answer-sheet-container">
      <h2>Answer Sheet</h2>

      <div className="user-info">
        <div className="card">
          <h3>Submitted By</h3>
          <p>
            <strong>Name:</strong> {answerData.SubmittedBy.name}
          </p>
          <p>
            <strong>Username:</strong> {answerData.SubmittedBy.username}
          </p>
        </div>
      </div>

      <div className="question-section">
        <h3>Question 1</h3>
        <div className="table-container">
          <table className="answers-table">
            <thead>
              <tr>
                <th>Question Number</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {answerData.answerDetails.question1.map((item, index) => (
                <tr key={index} className="table-row">
                  <td>{item.questionnumber}</td>
                  <td>
                    {item.items.map((subItem, subIndex) => (
                      <div key={subIndex} className="item-info">
                        {subItem.belongsTo} - <strong>{subItem.text}</strong>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="question-section">
        <h3>Question 2</h3>
        <div className="table-container">
          <table className="answers-table">
            <thead>
              <tr>
                <th>Question Number</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>
              {answerData.answerDetails.question2.map((item, index) => (
                <tr key={index} className="table-row">
                  <td>{item.questionnumber}</td>
                  <td>
                    {item.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="answer-info">
                        <strong>{answer.belongsTo}</strong> - {answer.text}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="question-section">
        <h3>Question 3</h3>
        <div className="table-container">
          <table className="answers-table">
            <thead>
              <tr>
                <th>Passage Number</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>
              {answerData.answerDetails.question3.map((item, index) => (
                <tr key={index} className="table-row">
                  <td>{item.passageNumber}</td>
                  <td>
                    {item.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="answer-info">
                        <strong>
                          Q {answerIndex + 1} : Selected Answer by User :
                          {answer.correctOption}
                        </strong>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswers;

///////////////////////////////////////////////////////////////user Interface 2////////////////////////////////////////////
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import "./ViewAnswer.css";

// const ViewAnswers = () => {
//   const { authorization_token,API } = useAuth();
//   const params = useParams();
//   const [answerData, setAnswerData] = useState(null);
//   const [answer, setAnswer] = useState(null);

//   // Fetch the answer sheet from the backend
//   const findCorrectAnswerSheet = async () => {
//     const id = params.answerId;
//     try {
//       const response = await fetch(
//         `${API}/api/MyQuestions/findAnswerSheet/${id}`,
//         {
//           method: "GET",
//           headers: { Authorization: authorization_token },
//         }
//       );
//       if (!response.ok) {
//         console.log("Error fetching data");
//         return;
//       }
//       const data = await response.json();
//       console.log("this is the data", data);
//       setAnswerData(data.question); // Store the answer data
//       setAnswer(data.answerDetails); // Store the answer details
//     } catch (error) {
//       console.error("Error fetching the answer sheet:", error);
//     }
//   };

//   useEffect(() => {
//     findCorrectAnswerSheet(); // Fetch answer data on mount
//   }, [authorization_token, params.answerId]);

//   // Render the data if available
//   if (!answerData) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4 text-primary">AnswerSheet</h2>

//       {/* Display answer table for Question 1 */}
//       {answerData.question1 && answerData.question1.length > 0 && (
//         <div className="mb-5">
//           <h3 className="text-secondary">Question 1</h3>
//           {answerData.question1.map((question, index) => (
//             <div key={index} className="card mb-4 p-4 shadow-sm">
//               <p>
//                 <strong>Description:</strong> {question.description}
//               </p>
//               <p>
//                 <strong>Points:</strong> {question.points}
//               </p>

//               {/* User's Answer for Question 1 */}
//               <p>
//                 <strong>Your Answer : </strong>
//                 {answer?.question1?.[index]?.items?.length > 0
//                   ? answer.question1[index].items.map((item, idx) => (
//                       <span key={idx}>
//                         {item.belongsTo} - {item.text || "No text available"}{" "}
//                         {idx < answer.question1[index].items.length - 1
//                           ? ", "
//                           : ""}
//                       </span>
//                     ))
//                   : "No answer provided"}
//               </p>

//               {/* Answers Table */}
//               <h4>Correct Answers:</h4>
//               <table className="table table-hover table-bordered">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>question</th>
//                     <th>Answer</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {question.items.map((item, idx) => (
//                     <tr key={idx} className="table-light">
//                       <td>{idx + 1}</td>
//                       <td>{item.belongsTo}</td>
//                       <td>{item.text}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Display answer table for Question 2 */}
//       {answerData.question2 && answerData.question2.length > 0 && (
//         <div className="mb-5">
//           <h3 className="text-secondary">Question 2</h3>
//           {answerData.question2.map((question, index) => (
//             <div key={index} className="card mb-4 p-4 shadow-sm">
//               <p>
//                 <strong>Sentence:</strong> {question.sentence}
//               </p>
//               <p>
//                 <strong>Preview:</strong> {question.preview}
//               </p>
//               <p>
//                 <strong>Points:</strong> {question.points}
//               </p>

//               {/* User's Answer for Question 2 */}
//               <p>
//                 <strong>Your Answer : </strong>
//                 {answer?.question2?.[index]?.answers?.length > 0
//                   ? answer.question2[index].answers.map((item, idx) => (
//                       <span key={idx}>
//                         {parseInt(item.belongsTo, 10) + 1} .
//                         {item.text || "No text available"}{" "}
//                         {idx < answer.question2[index].answers.length - 1
//                           ? ", "
//                           : ""}
//                       </span>
//                     ))
//                   : "No answer provided"}
//               </p>

//               {/* Answers Table */}
//               <div className="mb-4">
//                 <h4>Answers:</h4>
//                 {question.answers.map((answerText, idx) => (
//                   <div key={idx} className="mb-2">
//                     <strong>{String.fromCharCode(65 + idx)}.</strong>{" "}
//                     {answerText}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Display answer table for Question 3 */}
//       {answerData.question3 && answerData.question3.length > 0 && (
//         <div className="mb-5">
//           <h3 className="text-secondary">Question 3</h3>
//           {answerData.question3.map((question, index) => (
//             <div key={index} className="card mb-4 p-4 shadow-sm">
//               {/* Passage Number */}
//               <div className="d-flex align-items-center mb-3">
//                 <span
//                   className="badge bg-primary"
//                   style={{
//                     padding: "10px 20px",
//                     fontSize: "1.1rem",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Passage {index + 1}
//                 </span>
//               </div>

//               {/* Passage Text */}
//               <p>
//                 <strong>Passage Text:</strong> {question.passageText}
//               </p>

//               {/* Image (if available) */}
//               {question.pic && (
//                 <div>
//                   <img
//                     src={question.pic}
//                     alt="Passage"
//                     className="mt-2"
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "300px",
//                       objectFit: "contain",
//                       borderRadius: "8px",
//                     }}
//                   />
//                 </div>
//               )}

//               {/* User's Answer for Question 3 */}
//               <p className="mt-4">
//                 <strong>Your Answers : </strong>
//                 {answer?.question3?.[index]?.answers?.length > 0
//                   ? answer.question3[index].answers.map((item, idx) => (
//                       <span key={idx}>
//                         {item.questionNumber}.
//                         {item.correctOption || "No text available"}{" "}
//                         {idx < answer.question3[index].answers.length - 1
//                           ? ", "
//                           : ""}
//                       </span>
//                     ))
//                   : "No answer provided"}
//               </p>

//               {/* Answers */}
//               <div className="answers-section">
//                 <h4
//                   className="mb-3 mt-4"
//                   style={{ fontWeight: "600", color: "#333" }}
//                 >
//                   Answers:
//                 </h4>
//                 {question.questions.map((q, idx) => (
//                   <div
//                     key={idx}
//                     className="card mb-3 p-3 shadow-lg"
//                     style={{
//                       borderRadius: "12px",
//                       backgroundColor: "#f9f9f9",
//                       border: "1px solid #ddd",
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "16px",
//                     }}
//                   >
//                     {/* Question Label */}
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{
//                         width: "45px",
//                         height: "45px",
//                         backgroundColor: "#6c757d",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         fontSize: "1.2rem",
//                         borderRadius: "50%",
//                       }}
//                     >
//                       Q{idx + 1}
//                     </div>

//                     {/* Correct Option */}
//                     <div
//                       className="d-flex ms-4 justify-content-center align-items-center"
//                       style={{
//                         width: "45px",
//                         height: "45px",
//                         backgroundColor: "#28a745",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         fontSize: "1.5rem",
//                         borderRadius: "50%",
//                       }}
//                     >
//                       {String.fromCharCode(65 + idx)}
//                     </div>

//                     {/* Question Description */}
//                     <div
//                       style={{
//                         fontSize: "1rem",
//                         fontWeight: "500",
//                         color: "#333",
//                         marginLeft: "16px",
//                         flex: 1,
//                         wordWrap: "break-word",
//                       }}
//                     >
//                       {q.questionText}
//                     </div>

//                     {/* User's Answer */}
//                     <div
//                       style={{
//                         fontSize: "1rem",
//                         fontWeight: "500",
//                         color: "#333",
//                         marginLeft: "16px",
//                         flex: 1,
//                       }}
//                     >
//                       <strong>Your Answer:</strong>
//                       {answer?.question3?.[index]?.questions?.[idx]?.answer ||
//                         "No answer provided"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewAnswers;
