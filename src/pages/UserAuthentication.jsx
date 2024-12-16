import React, { useState } from "react";

import RegisterComponent from "../components/userAuth/RegisterComponent";
import LoginComponent from "../components/userAuth/loginComponent";

const UserAuthentication = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (index) => {
    setTabValue(index);
  };

  return (
    <>
      <div className="question-paper-header text-center mb-5 mt-4">
        <h3 className="text-muted">
          Note: You can enter any details in the registration form. Real details
          are not required.
        </h3>
      </div>
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: tabValue === 0 ? "#007bff" : "#f0f0f0",
                color: tabValue === 0 ? "#fff" : "#000",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleTabChange(0)}
            >
              Login
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: tabValue === 1 ? "#007bff" : "#f0f0f0",
                color: tabValue === 1 ? "#fff" : "#000",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleTabChange(1)}
            >
              Register
            </button>
          </div>

          <div>
            {tabValue === 0 ? <LoginComponent /> : <RegisterComponent />}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAuthentication;
