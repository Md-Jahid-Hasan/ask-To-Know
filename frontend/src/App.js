import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Email from "./pages/Email";
import Emailopen from "./pages/Emailopen";

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
                    element: <Emailopen/>
                },
            ],
        },
    ]);

    return (
        <RouterProvider router={router}/>
    );
}

export default App;
