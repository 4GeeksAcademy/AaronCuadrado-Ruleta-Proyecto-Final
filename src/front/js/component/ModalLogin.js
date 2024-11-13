import React, { useState } from "react";
import "../../styles/navbar-options/modalLogin.css";

export const ModalLogin = ({onClose}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //funcion para ejecutar el envio del formulario
    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            
            //si la respuesta no es exitosa
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Error al iniciar sesion.");
                return;
            }

            //Si el inicio es exitoso, maneja la respuesta
            const data = await response.json();
            console.log("Inicio de sesion exitoso", data);
            onClose();
        } catch (error) {
            console.error("Error al conectar con el backend",error);
            setErrorMessage("Error al conectar con el servidor");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Boton para cerrar el modal */}
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>

                {/* TItulo */}
                <h2>Iniciar Sesion</h2>

                {/* Formulario de inicio de sesion */}
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Correo Electronico</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required />
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    required />
                    {/* Mensaje de error */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {/* Boton para enviar el formulario */}
                    <button type="submit" className="submit-button">
                        Iniciar Sesion
                    </button>
                </form>
            </div>
        </div>
    );
};