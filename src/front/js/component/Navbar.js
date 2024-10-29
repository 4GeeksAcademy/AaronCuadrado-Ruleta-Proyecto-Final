import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); //Estado para controlar si el menu esta abierto o cerrado
    const navigate = useNavigate(); //Hook de navegacion para redirigir a otras rutas

    //Funcion para alternar la visibilidad del menu de navegacion
    const toggleMenu = () => {
        setIsOpen(!isOpen); //Cambia el estado entre abierto y cerrado
    };

    //Funcion para manejar el cierre de sesion
    const handleLogout = () => {
        localStorage.removeItem("token"); //Elimina el token de sesion del almacenamiento local

        //Marca en localStorage para mostrar el modal de cierre de sesion en la pagina principal
        localStorage.setItem("showLogoutModal", "true");
        navigate("/"); //Redirige al usuario a la pagina de inicio
        
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