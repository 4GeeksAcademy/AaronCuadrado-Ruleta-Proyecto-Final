import React, {useState} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Footer } from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
    const [balance, setBalance] = useState(200); // Saldo inicial del usuario

    //Funcion para autenticar al usuario y establecer su saldo
    const authenticateUser = (userBalance) => {
        setIsAuthenticated(true);
        setBalance(userBalance);
    };

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Routes>
                    <Route path="/" element={<Home authenticateUser={authenticateUser} />} />
                    <Route path="/main" element={isAuthenticated ? <MainPage balance={balance} /> : <Navigate to="/" />} />
                    <Route path="*" element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};
export default injectContext(Layout);
