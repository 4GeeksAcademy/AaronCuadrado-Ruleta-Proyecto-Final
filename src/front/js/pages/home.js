import React, { useState, useEffect } from "react";
import logo1 from "../../img/logo1.png";
import "../../styles/home/home.css";
import "../../styles/home/overlay.css";
import "../../styles/home/buttons.css";
import "../../styles/home/scrollbar.css";
import "../../styles/home/modals.css";
import { ModalRegister } from "../component/ModalRegister";
import { ModalLogin } from "../component/ModalLogin";

export const Home = () => {
    const [showRegisterModal, setShowRegisterModal] = useState(false); // Modal de registro
    const [showLoginModal, setShowLoginModal] = useState(false); // Modal de inicio de sesión
    const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal de cierre de sesión

    // Verifica si se debe mostrar el modal de cierre de sesión al cargar la página
    useEffect(() => {
        if (localStorage.getItem("showLogoutModal") === "true") {
            setShowLogoutModal(true); // Muestra el modal de cierre de sesión
            localStorage.removeItem("showLogoutModal"); // Elimina el indicador de localStorage
        }
    }, []);

    return (
        <div className="home-container">
            <div className="overlay">
                <img src={logo1} alt="Casino Logo" className="logo" />
                <h1>¡Bienvenido a la ruleta!</h1>
                <div className="buttons-container">
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="btn register-btn"
                        aria-label="Abrir modal de registro"
                    >
                        Registrarse
                    </button>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="btn login-btn"
                        aria-label="Abrir modal de inicio de sesión"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
            {/* Modal de registro */}
            {showRegisterModal && <ModalRegister setShowModal={setShowRegisterModal} />}
            {/* Modal de inicio de sesión */}
            {showLoginModal && <ModalLogin setShowModal={setShowLoginModal} />}
            {/* Modal de cierre de sesión, mostrado solo si showLogoutModal es verdadero */}
            {showLogoutModal && (
                <>
                    <div className="modal-logout-overlay"></div>
                    <div className="modal-logout">
                        <p>Has cerrado la sesión correctamente</p>
                        <button onClick={() => setShowLogoutModal(false)}>Cerrar</button>
                    </div>
                </>
            )}
        </div>
    );
};
