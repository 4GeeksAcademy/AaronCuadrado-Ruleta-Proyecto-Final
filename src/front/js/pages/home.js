import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo1 from "../../img/logo1.png";
import "../../styles/home.css";
import { ModalRegister } from "../component/ModalRegister";
import { ModalLogin } from "../component/ModalLogin"; 

export const Home = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);  // Estado para el modal de registro
  const [showLoginModal, setShowLoginModal] = useState(false);  // Estado para el modal de login

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
            Iniciar Sesion
          </button>
        </div>
      </div>

      {/* Mostrar el modal de registro */}
      {showRegisterModal && <ModalRegister setShowModal={setShowRegisterModal} />}
      {/* Mostrar el modal de login */}
      {showLoginModal && <ModalLogin setShowModal={setShowLoginModal} />}
    </div>
  );
};
