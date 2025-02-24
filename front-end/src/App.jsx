
import Header from "./components/Header"
import Footer from "./components/Footer"
import { ToastContainer } from 'react-toastify';
import { Outlet } from "react-router-dom";
const App = () => {

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  )
};


export default App