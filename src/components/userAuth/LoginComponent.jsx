import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [userDetail, setUserDetail] = useState({ email: "", password: "" });
  const { storeTokenInLS, API } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://assignment-backend-eight-self.vercel.app/?vercelToolbarCode=FAzilG0fL7lfJ6R/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDetail),
        }
      );
      const userInfo = await response.json();
      if (response.ok) {
        alert("Login successful");
        storeTokenInLS(userInfo.token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        navigate(`/`);
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserDetail({ ...userDetail, [name]: value });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "lightcyan",
        borderRadius: "10px",
      }}
    >
      <h4 style={{ textAlign: "center" }}>Login</h4>
      <form onSubmit={loginUser}>
        <input
          type="email"
          name="email"
          value={userDetail.email}
          onChange={handleChange}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          required
        />
        <input
          type="password"
          name="password"
          value={userDetail.password}
          onChange={handleChange}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
