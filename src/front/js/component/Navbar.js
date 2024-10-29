import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");

        localStorage.setItem("showLogoutModal", "true");
        navigate("/");
        
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-logo">La Ruleta Dorada</div>
            <div className="navbar-hamburger" onClick={toggleMenu}>
            ☰
            </div>
            {isOpen && (
                <div className="navbar-menu">
                    <Link to="/profile" className="navbar-item">Mi Perfil</Link>
                    <Link to="/add-funds" className="navbar-item">Recargar Saldo</Link>
                    <Link to="/withdraw" className="navbar-item">Retirar Fondos</Link>
                    <Link to="/transactions" className="navbar-item">Transacciones Historicas</Link>
                    <div onClick={handleLogout} className="navbar-item logout">Cerrar Sesion</div>                
                </div>
            )}
        </nav>
    );
};