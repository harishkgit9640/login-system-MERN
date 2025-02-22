import Header from "./components/Header"
import Footer from "./components/Footer"
import { ToastContainer } from 'react-toastify';

import Routes from "./components/Routes";
const App = () => {
  return (
    <>
      <Header />
      <Routes />
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App