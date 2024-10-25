import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Email from "./pages/Email";
import {EmailOpen} from "./pages/Emailopen";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
import {Forgot} from "./pages/Forgot";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/chat" element={<Email/>}></Route>
            <Route path="/chat/:id" element={<EmailOpen/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/change-password" element={<Forgot/>}></Route>
        </Routes>
    );
}

export default App;
