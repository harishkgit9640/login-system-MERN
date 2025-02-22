import Login from "./Login";
import Dashboard from "./Dashboard"
import Error from "./Error"
import Contact from "./Contact"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Routes = () => {
    const appRouter = createBrowserRouter(
        [

            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: '*',
                errorElement: <Error />
            }
        ])

    return (
        <RouterProvider router={appRouter} />
    )
}

export default Routes