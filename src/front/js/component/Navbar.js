import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar-options/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                const response = await fetch("https://ominous-fishstick-g4x796gg6wr4fwp47-3001.app.github.dev/api/session-info", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.user && typeof data.user.balance !== 'undefined') {
                        actions.updateBalance(data.user.balance);
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

        fetchSessionInfo();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("https://ominous-fishstick-g4x796gg6wr4fwp47-3001.app.github.dev/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                localStorage.setItem("showLogoutModal", "true");
                actions.logout();
                navigate("/");
            } else {
                console.error("Error al cerrar sesión en el backend.");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate("/menu")}>
                La Ruleta Dorada
            </div>
            <button className="menu-button" onClick={() => navigate("/menu")}>
                Menu Principal
            </button>
            <div className="balance-display">
                Balance: {store.userBalance !== undefined ? store.userBalance.toFixed(2) : "0.00"} €
            </div>
            <div className="navbar-hamburger" onClick={toggleMenu}>
                ☰
            </div>
            {isOpen && (
                <div className="navbar-menu" onClick={() => setIsOpen(false)}>
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
