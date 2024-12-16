import React from "react";
import Question1 from "../components/Admin Component/Question1";
import Question2 from "../components/Admin Component/Question2";
import Question3 from "../components/Admin Component/Question3";
import { useAuth } from "../store/auth";

const Admin = () => {
  const { setSubmitted } = useAuth();
  const handleSubmit = () => {
    setSubmitted(1);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Question1 />
      <Question2 />
      <Question3 />

      <div
        style={{
          position: "relative",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "green",
            color: "white",
            fontSize: "18px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Admin;
