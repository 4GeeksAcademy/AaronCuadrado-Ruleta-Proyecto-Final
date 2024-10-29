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
    const [showRegisterModal, setShowRegisterModal] = useState(false);//Modal de registro
    const [showLoginModal, setShowLoginModal] = useState(false);//Modal de inicio de sesion
    const [showLogoutModal, setShowLogoutModal] = useState(false);//Modal de cierre de sesion

    //useEffect para verificar si se debe mostrar el modal de cierre de sesion al cargar la pagina
    useEffect(() =>{
        //si showLogoutModal esta en localStorage, muestra el modal de cierre de sesion y luego lo elimina
        if (localStorage.getItem("showLogoutModal") === "true") {
            setShowLogoutModal(true); //Muestra el modal de cierre de sesion
            localStorage.removeItem("showLogoutModal"); //Elimina el indicador de localStorage
        
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
            {/* Modal de registro */}
            {showRegisterModal && <ModalRegister setShowModal={setShowRegisterModal} />}
            {/* Modal de inicio de sesion */}
            {showLoginModal && <ModalLogin setShowModal={setShowLoginModal} />}
            {/* Modal de cierre de sesion, mostrado solo si showlogout es verdadero */}
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
