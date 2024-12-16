import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const authorization_token = `Bearer ${token}`;
  const [submitted, setSubmitted] = useState(0);
  const [submitAnswer, setSubmitAnswer] = useState(0);
  const [newQuestionId, setNewQuestionId] = useState("");
  const [newAnswerId, setNewAnswerId] = useState("");
  const [API, setAPI] = useState(import.meta.env.VITE_APP_URI_API);

  const storeTokenInLS = (servertoken) => {
    setToken(servertoken);

    return localStorage.setItem("token", servertoken);
  };

  const logout_user = () => {
    setToken("");
    setUser("");
    localStorage.removeItem("userInfo");
    return localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    try {
      const response = await fetch(
        "https://assignment-backend-eight-self.vercel.app/api/auth/userDetails",
        {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        // console.log(data);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data");
    }
  };
  let isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      userAuthentication();
    }
  }, [isLoggedIn]);
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        setUser,
        user,
        authorization_token,
        storeTokenInLS,
        logout_user,
        isLoggedIn,
        submitted,
        setSubmitted,
        newQuestionId,
        setNewQuestionId,
        submitAnswer,
        setSubmitAnswer,
        newAnswerId,
        setNewAnswerId,
        API,
        setAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const AuthContextvalue = useContext(AuthContext);
  if (!AuthContextvalue) {
    throw new Error("useAuth used outside of the provider");
  }
  return AuthContextvalue;
};
