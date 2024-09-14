import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" component={<RootLayout/>}>
      <Route index element={<Login />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
      <Route path='unauthorized' element={<UnauthorizedPage />} />
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
