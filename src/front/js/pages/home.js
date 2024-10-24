import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo1 from "../../img/logo1.png";
import "../../styles/home.css";  // Estilos generales para la home
import { ModalRegister } from "../component/ModalRegister";  // Importar el componente ModalRegister

export const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-container">
      <div className="overlay">
        <img src={logo1} alt="Casino Logo" className="logo" />
        <h1>¡Bienvenido a la ruleta!</h1>
        <div className="buttons-container">
          <button onClick={() => setShowModal(true)} className="btn register-btn">
            Registrarse
          </button>
          <Link to="/login" className="btn login-btn">
            Iniciar Sesión
          </Link>
        </div>
      </div>

      {/* Mostrar el modal si se ha hecho clic en registrarse */}
      {showModal && <ModalRegister setShowModal={setShowModal} />}
    </div>
  );
};
