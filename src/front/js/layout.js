import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Footer } from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
