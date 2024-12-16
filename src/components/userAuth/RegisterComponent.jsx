import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const { storeTokenInLS, API } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const sendUserDetails = async (e) => {
    e.preventDefault();
    if (userDetail.password !== userDetail.confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        const response = await fetch(
          `https://vercel.com/ghanshyams-projects-d2cc8797/assignment-backend/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userDetail),
          }
        );

        const userInfo = await response.json();
        if (response.ok) {
          alert("Registration successful");
          setUserDetail({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
          storeTokenInLS(userInfo.token);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          navigate(`/`);
        } else {
          alert(userInfo.msg);
        }
      } catch (error) {
        alert("An error occurred, please try again");
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "lightcyan",
        borderRadius: "10px",
      }}
    >
      <h4 style={{ textAlign: "center" }}>Create Account</h4>
      <form onSubmit={sendUserDetails}>
        <input
          type="text"
          name="name"
          value={userDetail.name}
          onChange={handleChange}
          placeholder="Name"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          required
        />
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
          type="tel"
          name="phone"
          value={userDetail.phone}
          onChange={handleChange}
          placeholder="Phone"
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
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={userDetail.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
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
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;
