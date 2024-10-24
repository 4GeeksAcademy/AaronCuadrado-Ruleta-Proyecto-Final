import React, { useState } from "react";
import "../../styles/modalLogin.css";  // Estilos del modal de login

export const ModalLogin = ({ setShowModal }) => {
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);  // Estado para mostrar el mensaje de ayuda
    const [showError, setShowError] = useState(false);  // Estado para manejar errores de inicio de sesión

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Inicio de sesión exitoso");
                setShowModal(false);  // Cerrar el modal si el inicio de sesión es exitoso
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                setShowError(true);  // Mostrar mensaje de error
            }
        } catch (error) {
            console.error("Error:", error);
            setShowError(true);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        
                    />


                    {showError && (
                        <p className="error-message">
                            Usuario o contraseña incorrectos.
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>
                <button onClick={() => setShowModal(false)} className="btn-close">
                </button>
            </div>
        </div>
    );
};
