import Header from "./components/Header"
import Footer from "./components/Footer"
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {

    const authToken = localStorage.getItem("authToken");

    return authToken ? (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    ) : <Navigate to="/login" />

};

export default PrivateRoute