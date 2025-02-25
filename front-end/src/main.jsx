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
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

const authToken = localStorage.getItem('authToken');

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='' element={<Dashboard />} />
      <Route path='contact' element={<Contact />} />
      <Route path='*' element={<Error />} />
      {/* <Route path='user/:userid' element={<User />} /> */}
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />;
    </Provider>
  </StrictMode>,
)
