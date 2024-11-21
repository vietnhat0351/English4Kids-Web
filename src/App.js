import { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/admin-layout/AdminLayout";
import UserLayout from "./layouts/user-layout/UserLayout";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";

import EmptyLayout from "./layouts/empty-layout/EmptyLayout";
import CreateFlashcardSet from "./pages/user/create-flashcard-set/CreateFlashcardSet";
import Flashcard from "./pages/user/flashcard/Flashcard";
import LearnFlashcard from "./pages/user/flashcard/LearnFlashcard";
import Grammar from "./pages/user/grammar/Grammar";
import Home from "./pages/user/homepage/Home";
import Learn from "./pages/user/learn/Learn";
import Profile from "./pages/user/profile/Profile";
import Vocabulary from "./pages/user/vocabulary/Vocabulary";

import DataAnalysis from "./pages/admin/data-analysis/DataAnalysis";
import HomePage from "./pages/admin/home-page/HomePage";
import LessonManagement from "./pages/admin/lesson-management/LessonManagement";
import TestManagement from "./pages/admin/test-management/TestManagement";
import UserManagement from "./pages/admin/user-management/UserManagement";
import VocabularyManagement from "./pages/admin/vocabulary-management/VocabularyManagement";
import EditFlashcardSet from "./pages/user/flashcard/edit-flashcard-set/EditFlashcardSet";

import Question from "./pages/admin/lesson-management/question/Question";
import LearnSession from "./pages/user/learn/LearnSessin/LearnSession";

import axios from "axios";
import { useDispatch } from "react-redux";
import WorkShake from "./pages/game/WorkShake";
import CardMatchingGame from "./pages/user/flashcard/card-matching-game/CardMatchingGame";
import ReviewFlashcard from "./pages/user/flashcard/review-flashcard/ReviewFlashcard";
import LearnQuestion from "./pages/user/learn/learnQuestion/LearnQuestion";
import Ranking from "./pages/user/ranking/Ranking";
import { setUserProfile } from "./redux/slices/userSlice";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      style={{
        border: "5px solid red",
      }}
    >
      <Route element={<AdminLayout />} path="/admin">
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
          <Route index element={<HomePage />} />
          <Route path="lesson">
            <Route index element={<LessonManagement />} />
            <Route path=":lessonId" element={<Question />} />
          </Route>
          <Route path="vocabulary" element={<VocabularyManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="test" element={<TestManagement />} />
          <Route path="data" element={<DataAnalysis />} />
        </Route>
      </Route>

      <Route element={<UserLayout />}>
        <Route element={<ProtectedRoute roles={["ROLE_USER"]} />}>
          <Route index element={<Home />} />
          <Route path="learn">
            <Route index element={<Learn />} />
            <Route path=":lessonId" element={<LearnSession />} />
            <Route path="question/:lessonId" element={<LearnQuestion />} />
            <Route path="vocabulary/:lessonId" element={<Vocabulary />} />
          </Route>

          <Route path="flashcard">
            <Route index element={<Flashcard />} />
            <Route path="create" element={<CreateFlashcardSet />} />
            <Route path=":flashcardSetId" element={<LearnFlashcard />} />
            <Route path=":flashcardSetId/edit" element={<EditFlashcardSet />} />
            <Route
              path=":flashcardSetId/card-matching"
              element={<CardMatchingGame />}
            />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>
      </Route>

      <Route element={<EmptyLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="review-flashcard/:flashcardSetId" element={<ReviewFlashcard />} />
        <Route path="practice" element={<WorkShake />} />
        <Route path="flashcard/:flashcardSetId/card-matching" element={<CardMatchingGame />}
        />
      </Route>
    </Route>
  )
);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleAuthMessage = (event) => {
      const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];
      if (allowedOrigins.includes(event.origin)) {
        const authResponse = event.data.authResponse;
        if (authResponse) {
          localStorage.setItem("accessToken", authResponse?.accessToken);
          localStorage.setItem("refreshToken", authResponse?.refreshToken);

          axios
            .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
              headers: {
                Authorization: `Bearer ${authResponse?.accessToken}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              dispatch(setUserProfile(response.data));
              if (response.data.role === "ADMIN") {
                window.location.href = "/admin";
              } else {
                window.location.href = "/";
              }
            })
            .catch((error) => {
              console.error(error);
            });

          // Handle successful login, e.g., update UI or redirect
          window.location.href = "/";
        }
        if (event.origin !== window.location.origin) {
          return;
        }
      }
    };

    window.addEventListener("message", handleAuthMessage);

    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
