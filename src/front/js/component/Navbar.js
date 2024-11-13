import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar-options/navbar.css";
import logo from "../../img/logo1.png";

export const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Logo de la web */}
                <div className="navbar-logo">
                    <Link to="/">
                    <img src={logo} alt="Veloce logo" className="logo" />
                    </Link>
                </div>

                {/* Botones del navbar */}
                <div className="navbar-buttons">
                    <Link to="/vehicles" className="navbar-link">
                    Ver Vehiculos
                    </Link>
                    <Link to="/register" className="navbar-link">
                    Registro
                    </Link>
                    <Link to="/login" className="navbar-link">
                    Iniciar Sesion
                    </Link>
                </div>
            </div>
        </div>
    );
};   