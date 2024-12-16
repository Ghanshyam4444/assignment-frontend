import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Admin from "./pages/Admin";
import User from "./pages/User";
import NavLinks from "./components/Home/Navlink";
import { useAuth } from "./store/auth";
import UserAuthentication from "./pages/UserAuthentication";
import QuestionPaper from "./pages/QuestionPaper";
import MyQuestions from "./pages/MyQuestions";
import ViewAnswers from "./pages/ViewAnswers";
import ViewSubmissions from "./pages/ViewSubmissions";
import ViewCorrectAnswers from "./pages/ViewCorrectAnswers";

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn ? (
        <>
          <NavLinks />
          <Routes>
            <Route path="/" element={<User />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/questionpaper/:id" element={<QuestionPaper />} />
            <Route path="/MyQuestions" element={<MyQuestions />} />
            <Route
              path="/viewSubmission/:questionId"
              element={<ViewSubmissions />}
            />
            <Route
              path="/viewAnswerSheet/:answerId"
              element={<ViewAnswers />}
            />
            <Route
              path="/CorrectAnswer/:questionId"
              element={<ViewCorrectAnswers />}
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<UserAuthentication />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
