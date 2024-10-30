import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para el menú
    const { store, actions } = useContext(Context); // Obtener el balance del contexto y acciones
    const navigate = useNavigate();

    // useEffect para obtener el balance una sola vez al montar el componente
    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                const response = await fetch("https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/session-info", {
                    method: "GET",
                    credentials: "include", // Incluir cookies de sesión
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.user && typeof data.user.balance !== 'undefined') {
                        console.log("Balance recibido desde el backend:", data.user.balance);
                        actions.updateBalance(data.user.balance); // Actualizar el balance en el contexto
                    } else {
                        console.log("La estructura de datos no contiene 'user' o 'balance'.", data);
                    }
                } else {
                    console.log("No hay sesión activa.");
                }
            } catch (error) {
                console.error("Error al verificar la sesión:", error);
            }
        };

        fetchSessionInfo(); // Llamar a la función al montar el componente
    }, []); // <--- Array de dependencias vacío para ejecutar solo una vez

    // Función para alternar el menú
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            const response = await fetch("https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                console.log("Sesión cerrada en el backend");
                localStorage.setItem("showLogoutModal", "true"); // Marca en localStorage para que Home.js lo detecte
                actions.logout(); // Actualiza el estado global al cerrar sesión
                navigate("/"); // Redirige al usuario a la página de inicio
            } else {
                console.error("Error al cerrar sesión en el backend.");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">La Ruleta Dorada</div>
            <button className="menu-button" onClick={() => navigate("/menu")}>
                Menu Principal
            </button>
            <div className="balance-display">
                Balance: {store.userBalance} €
            </div>

            <div className="navbar-hamburger" onClick={toggleMenu}>
                ☰
            </div>
            {isOpen && (
                <div className="navbar-menu">
                    <Link to="/profile" className="navbar-item">Mi Perfil</Link>
                    <Link to="/add-funds" className="navbar-item">Recargar Saldo</Link>
                    <Link to="/withdraw" className="navbar-item">Retirar Fondos</Link>
                    <Link to="/transactions" className="navbar-item">Transacciones Históricas</Link>
                    <div onClick={handleLogout} className="navbar-item logout">Cerrar Sesión</div>                
                </div>
            )}
        </nav>
    );
};
