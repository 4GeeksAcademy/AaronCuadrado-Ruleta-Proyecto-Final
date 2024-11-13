import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar-options/navbarAfter.css";
import logo from "../../img/logo1.png";
import { Context } from "../store/appContext";

export const NavbarAfterLogin = () => {
    const { actions } = useContext(Context);
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const toggleHamburgerMenu = () => {
        if (isMounted) setShowHamburgerMenu(!showHamburgerMenu);
    };

    const handleLogout = () => {
        if (isMounted) {
            actions.logout();
            setShowHamburgerMenu(false);
        }
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

                {/* Menú después de iniciar sesión */}
                <div className="navbar-buttons">
                    <Link to="/vehicles" className="navbar-link">
                        Ver Vehículos
                    </Link>
                    <div className="hamburger-menu">
                        <button className="hamburger-icon" onClick={toggleHamburgerMenu}>
                            &#9776;
                        </button>
                        {showHamburgerMenu && (
                            <div className="hamburger-dropdown">
                                <Link to="/profile" className="navbar-link">
                                    Mi Perfil
                                </Link>
                                <Link to="/reservations" className="navbar-link">
                                    Mis Reservas
                                </Link>
                                <Link to="/maintenances" className="navbar-link">
                                    Mis Mantenimientos
                                </Link>
                                <button className="navbar-link logout-button" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
