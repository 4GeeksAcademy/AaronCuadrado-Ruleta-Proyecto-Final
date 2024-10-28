import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modalLogin.css";
import { Context } from "../store/appContext";  // Importa el contexto

export const ModalLogin = ({ setShowModal }) => {
    const { actions } = useContext(Context);  // Accede a las acciones de flux
    const [showError, setShowError] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

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
                const data = await response.json(); // Obtener datos de saldo
                actions.login(data.balance); // Llama a la acción login para actualizar el estado global
                setShowSuccessModal(true);  // Muestra el modal de éxito
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                setShowError(true);
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
                    <input type="password" id="password" name="password" required />

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

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="success-modal">
                    <div className="success-modal-content">
                        <h3>¡Inicio de sesión exitoso!</h3>
                        <p>Has iniciado sesión correctamente.</p>
                        <button className="btn-close-success" onClick={() => {
                            setShowSuccessModal(false);
                            setShowModal(false);
                            navigate("/menu");  // Redirigir a la página de menú
                        }}>
                            Acceder
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
