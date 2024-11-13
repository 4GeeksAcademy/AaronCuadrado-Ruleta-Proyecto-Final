import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import injectContext, { Context } from "./store/appContext";
import { Footer } from "./component/footer";
import { Navbar } from "./component/Navbar";

const Layout = () => {
    const { store } = useContext(Context);
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};
export default injectContext(Layout);
