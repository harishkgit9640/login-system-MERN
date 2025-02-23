import Header from "./components/Header"
import Footer from "./components/Footer"
import { ToastContainer } from 'react-toastify';

import Layout from "./components/Layout";
const App = () => {
  return (
    <>
      <Header />
      <Layout />
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App