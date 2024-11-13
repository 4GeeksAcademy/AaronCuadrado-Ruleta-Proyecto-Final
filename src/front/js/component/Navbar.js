import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar-options/navbar.css";
import logo from "../../img/logo1.png";
import { ModalRegister } from "../component/ModalRegister";
import { ModalLogin } from "../component/ModalLogin";

export const Navbar = () => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Cleanup automático para evitar actualizaciones en componentes desmontados
    useEffect(() => {
        let isMounted = true;

        return () => {
            isMounted = false;
        };
    }, []);

    // Manejo de apertura de modales
    const openLoginModal = () => {
        setShowLoginModal(true);
    };

    const openRegisterModal = () => {
        setShowRegisterModal(true);
    };

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Logo de la web */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={logo} alt="Veloce logo" className="logo" />
                    </Link>
                    <span className="navbar-title">Veloce Renting</span>
                </div>

                {/* Botones del navbar */}
                <div className="navbar-buttons">
                    <Link to="/vehicles" className="navbar-link">
                        Ver Vehículos
                    </Link>
                    <button className="navbar-link" onClick={openRegisterModal}>
                        Registrarse
                    </button>
                    <button className="navbar-link" onClick={openLoginModal}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>
            {/* Modales */}
            {showRegisterModal && <ModalRegister onClose={() => setShowRegisterModal(false)} />}
            {showLoginModal && <ModalLogin onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};
