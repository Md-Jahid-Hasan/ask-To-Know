import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Email from "./pages/Email";
import {EmailOpen} from "./pages/Emailopen";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
import {Forgot} from "./pages/Forgot";

function App() {
    const router = createBrowserRouter([
        {
            children: [
                {
                    path: "/",
                    element: <Home/>
                },
                {
                    path: "/chat",
                    element: <Email/>
                },
                {
                    path: "/chat/:id",
                    element: <EmailOpen/>
                },
                {
                    path: "/login",
                    element: <Login/>
                },
                {
                    path: "/register",
                    element: <Register/>
                },
                {
                    path: "/change-password",
                    element: <Forgot/>
                }
            ],
        },
    ]);

    return (
        <RouterProvider router={router}/>
    );
}

export default App;
