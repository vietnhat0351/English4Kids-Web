import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AdminLayout from "./layouts/admin-layout/AdminLayout";
import UserLayout from "./layouts/user-layout/UserLayout";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/user/profile/Profile";
import Learn from "./pages/user/learn/Learn";
import Flashcard from "./pages/user/flashcard/Flashcard";
import Vocabulary from "./pages/user/vocabulary/Vocabulary";
import Home from "./pages/user/homepage/Home";
import CreateFlashcardSet from "./pages/user/create-flashcard-set/CreateFlashcardSet";
import LearnFlashcard from "./pages/user/flashcard/LearnFlashcard";
import EmptyLayout from "./layouts/empty-layout/EmptyLayout";
import HomePage from "./pages/admin/home-page/HomePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" style={{
      border: "5px solid red",
    }}>
      <Route element={<AdminLayout />} path="/admin">
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>

      <Route element={<UserLayout />}>
        <Route element={<ProtectedRoute roles={["ROLE_USER"]} />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="flashcard" >
            <Route index element={<Flashcard />} />
            <Route path="create" element={<CreateFlashcardSet />} />
            {/* <Route path="edit/:flashcardSetId" element={<CreateFlashcardSet />} /> */}
            <Route path=":flashcardSetId" element={<LearnFlashcard />} />
          </Route>
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route element={<EmptyLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Route>
  )
);

function App() {
  useEffect(() => {
    const handleAuthMessage = (event) => {
      const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];
      if (allowedOrigins.includes(event.origin)) {
        const authResponse = event.data.authResponse;
        if (authResponse) {
          localStorage.setItem("accessToken", authResponse?.accessToken);
          localStorage.setItem("refreshToken", authResponse?.refreshToken);
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
    // border: 1px solid #e0e0e0; className="App"
    <div style={{
      // border: "5px solid black",
    }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
