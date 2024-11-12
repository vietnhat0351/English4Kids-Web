import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import AdminLayout from "./layouts/admin-layout/AdminLayout";
import UserLayout from "./layouts/user-layout/UserLayout";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";

import Learn from "./pages/user/learn/Learn";
import Flashcard from "./pages/user/flashcard/Flashcard";
import Vocabulary from "./pages/user/vocabulary/Vocabulary";
import Home from "./pages/user/homepage/Home";
import CreateFlashcardSet from "./pages/user/create-flashcard-set/CreateFlashcardSet";
import LearnFlashcard from "./pages/user/flashcard/LearnFlashcard";
import EmptyLayout from "./layouts/empty-layout/EmptyLayout";
import Grammar from "./pages/user/grammar/Grammar";
import Profile from "./pages/user/profile/Profile";
import Practice from "./pages/practice/Practice";
import Topic from "./pages/user/vocabulary/topic/Topic";

import HomePage from "./pages/admin/home-page/HomePage";
import EditFlashcardSet from "./pages/user/flashcard/edit-flashcard-set/EditFlashcardSet";
import LessonManagement from "./pages/admin/lesson-management/LessonManagement";
import VocabularyManagement from "./pages/admin/vocabulary-management/VocabularyManagement";
import UserManagement from "./pages/admin/user-management/UserManagement";
import TestManagement from "./pages/admin/test-management/TestManagement";
import DataAnalysis from "./pages/admin/data-analysis/DataAnalysis";

import Question from "./pages/admin/lesson-management/question/Question";
import LearnSession from "./pages/user/learn/LearnSessin/LearnSession";

import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "./redux/slices/userSlice";
import WorkShake from "./pages/game/WorkShake";
import CardMatchingGame from "./pages/user/flashcard/card-matching-game/CardMatchingGame";
import ReviewFlashcard from "./pages/user/flashcard/review-flashcard/ReviewFlashcard";
import Ranking from "./pages/user/ranking/Ranking";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<AdminLayout />} path="/admin">
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
          <Route index element={<HomePage />} />
          <Route path="lesson" >
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


          <Route path="learn" element={<Learn />} />
          <Route path="flashcard">
            <Route index element={<Flashcard />} />
            <Route path="create" element={<CreateFlashcardSet />} />
            {/* <Route path="edit/:flashcardSetId" element={<CreateFlashcardSet />} /> */}
            <Route path=":flashcardSetId" element={<LearnFlashcard />} />
            <Route path=":flashcardSetId/edit" element={<EditFlashcardSet />} />
            {/* <Route path=":flashcardSetId/card-matching" element={<CardMatchingGame />} /> */}
          </Route>
          <Route path="vocabulary">
            <Route index element={<Vocabulary />} />
            <Route path=":topicId" element={<Topic />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="grammar" element={<Grammar />} />
          {/* <Route path="practice" element={<Practice />} /> */}
          
          <Route path="ranking" element={<Ranking />} />
        </Route>
      </Route>


      <Route element={<EmptyLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="learn-session/:lessonId/part/:partId" element={<LearnSession />} />
        <Route path="review-flashcard/:flashcardSetId" element={<ReviewFlashcard />} />
        <Route path="flashcard/:flashcardSetId/card-matching" element={<CardMatchingGame />} />
        <Route path="practice" element={<WorkShake />} />
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
              // window.location.href = "/";
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
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
