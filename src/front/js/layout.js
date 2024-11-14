import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import injectContext, { Context } from "./store/appContext";
import { Footer } from "./component/footer";
import { NavbarWrapper } from "./component/NavbarWrapper";
import { Vehicles } from "./pages/Vehicles";
import { AdminAddVehicle } from "./pages/AdminAddVehicle";
import { AdminManageVehicles } from "./pages/AdminManageVehicles";
import { Profile } from "./pages/Profile.js";
import { Reserve } from "./pages/Reserve.js";
import { Cancel } from "./pages/Cancel.js";
import { Success } from "./pages/Success.js";

const Layout = () => {
    const { store } = useContext(Context);
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <NavbarWrapper />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/admin/add-vehicle" element={<AdminAddVehicle />} />
                    <Route path="/admin/manage-vehicles" element={<AdminManageVehicles />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reserve" element={<Reserve />} />
                    <Route path="/reserve-vehicle/success" element={<Success />} />
                    <Route path="/reserve-vehicle/cancel" element={<Cancel />} />
                    <Route path="*" element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};
export default injectContext(Layout);
