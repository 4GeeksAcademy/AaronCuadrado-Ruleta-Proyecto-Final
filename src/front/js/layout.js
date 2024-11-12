import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import injectContext, { Context } from "./store/appContext";
import { Footer } from "./component/footer";
import { Menu } from "./pages/Menu";
import { Transactions } from "./pages/Transactions";
import { WithdrawFunds } from "./pages/WithdrawFunds";
import { AddFunds } from "./pages/AddFunds";
import { Success } from "./pages/Success";
import { Cancel } from "./pages/Cancel";
import Blackjack  from "./pages/Blackjack";

const Layout = () => {
    const { store } = useContext(Context);
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={store.isAuthenticated ? <Menu /> : <Navigate to="/" />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/withdraw" element={<WithdrawFunds />} />
                    <Route path="/add-funds" element={<AddFunds />} />
                    <Route path="/add-funds/success" element={<Success />} />
                    <Route path="/add-funds/cancel" element={<Cancel />} />
                    <Route path="/blackjack" element={<Blackjack />} />
                    <Route path="*" element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};
export default injectContext(Layout);
