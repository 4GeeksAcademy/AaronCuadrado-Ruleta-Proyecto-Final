import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modalLogin.css";
import { Context } from "../store/appContext"; 

export const ModalLogin = ({ setShowModal }) => {
    const { actions } = useContext(Context); 
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
            // Realizar la solicitud de inicio de sesión a la API con las credenciales incluidas
            const response = await fetch('https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Incluir las cookies en la solicitud
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const data = await response.json();
                actions.login(data.user); // Actualizar el estado global con el usuario y su balance
                setShowSuccessModal(true);  // Mostrar el modal de éxito
                setShowError(false); // Asegurarse de que el mensaje de error esté oculto si fue exitoso
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                setShowError(true); // Mostrar mensaje de error si la respuesta no es 200 OK
            }
        } catch (error) {
            console.error("Error:", error);
            setShowError(true); // Mostrar mensaje de error si ocurre una excepción
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
                    
                    {/* Modal de error por credenciales incorrectas */}
                    {showError && (
                        <p className="error-message">
                            Usuario o contraseña incorrectos.
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>
                {/* Botón para cerrar el modal */}
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
                            setShowSuccessModal(false); // Ocultar el modal de éxito
                            setShowModal(false); // Cerrar el modal de inicio de sesión
                            navigate("/menu");  // Redirigir a la página de menú
                        }}>
                            Acceder a la web
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
