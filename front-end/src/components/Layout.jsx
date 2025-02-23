import Login from "./Login";
import Dashboard from "./Dashboard";
import Error from "./Error";
import Contact from "./Contact";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// ProtectedRoute component to check for authentication
const ProtectedRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the protected component if authenticated
    return children;
};

// Layout component to define the routing structure
const Layout = () => {
    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {

            path: "/login",
            element: localStorage.getItem('authToken') ? <Navigate to="/" /> : <Login />,

        },
        {
            path: "/contact",
            element: (
                <ProtectedRoute>
                    <Contact />
                </ProtectedRoute>
            ),
        },
        {
            path: '*',
            element: <Error />,
        },
    ]);

    return <RouterProvider router={appRouter} />;
};

export default Layout;