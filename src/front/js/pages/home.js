import React, { useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de que está importado
import logo1 from "../../img/logo1.png";
import "../../styles/home.css";

export const Home = () => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

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

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrarse</h2>
            <form>
              <label htmlFor="username">Nombre de usuario:</label>
              <input type="text" id="username" name="username" required />

              <label htmlFor="email">Correo electrónico:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" name="password" required />

              <button type="submit" className="btn-submit">Registrarse</button>
            </form>
            <button onClick={() => setShowModal(false)} className="btn-close">
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
