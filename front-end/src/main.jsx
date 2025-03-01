import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import appStore from './store/appStore'
import './index.css'
import App from './App.jsx'
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import Contact from "./components/Contact";
import About from "./components/About";
import Profile from "./components/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from './PrivateRoute.jsx'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/about", element: <About /> },
      { path: "/profile", element: <Profile /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <Error /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />;
    </Provider>
  </StrictMode>,
)
