import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useEffect } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import Home from './pages/user/homepage/Home';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" component={<RootLayout />}>
      <Route element={<ProtectedRoute roles={['ROLE_USER']} />} >
        <Route index element={<Home />} />
      </Route>
      <Route element={<ProtectedRoute roles={['ROLE_ADMIN']} />} >
        <Route index element={<Home />} />
        <Route path='/profile' element={<Profile/>} />
      </Route>
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
      <Route path='unauthorized' element={<UnauthorizedPage />} /> 
    </Route>
  )
);

function App() {

  useEffect(() => {
    const handleAuthMessage = (event) => {
      const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000'];
      if (allowedOrigins.includes(event.origin)) {
        // console.log("Origin: " + event.origin);

        const authResponse = event.data.authResponse;
        if (authResponse) {

          localStorage.setItem('accessToken', authResponse?.accessToken);
          localStorage.setItem('refreshToken', authResponse?.refreshToken);
          // Handle successful login, e.g., update UI or redirect
          window.location.href = '/';
        }
        if (event.origin !== window.location.origin) {
          return;
        }
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
