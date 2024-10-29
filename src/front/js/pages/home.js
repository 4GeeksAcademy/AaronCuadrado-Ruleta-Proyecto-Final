import React, { useState, useEffect } from "react";
import logo1 from "../../img/logo1.png";
import "../../styles/home/home.css";
import "../../styles/home/overlay.css";
import "../../styles/home/buttons.css";
import "../../styles/home/responsive.css";
import "../../styles/home/scrollbar.css";
import "../../styles/home/modals.css";
import { ModalRegister } from "../component/ModalRegister";
import { ModalLogin } from "../component/ModalLogin";

export const Home = () => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() =>{
        if (localStorage.getItem("showLogoutModal") === "true") {
            setShowLogoutModal(true);
            localStorage.removeItem("showLogoutModal");
        
        }
    }, []);

    return (
        <div className="home-container">
            <div className="overlay">
                <img src={logo1} alt="Casino Logo" className="logo" />
                <h1>¡Bienvenido a la ruleta!</h1>
                <div className="buttons-container">
                    <button onClick={() => setShowRegisterModal(true)} className="btn register-btn">
                        Registrarse
                    </button>
                    <button onClick={() => setShowLoginModal(true)} className="btn login-btn">
                        Iniciar Sesión
                    </button>
                </div>
            </div>

            {showRegisterModal && <ModalRegister setShowModal={setShowRegisterModal} />}
            {showLoginModal && <ModalLogin setShowModal={setShowLoginModal} />}

            {showLogoutModal && (
                <>
                    <div className="modal-logout-overlay"></div>
                    <div className="modal-logout">
                        <p>Has cerrado la sesion correctamente</p>
                        <button onClick={() => setShowLogoutModal(false)}>Cerrar</button>
                    </div>
                </>
            )}
        </div>
    );
};
