import React, { useState } from "react";
import "../../styles/modalLogin.css";  

export const ModalLogin = ({ setShowModal }) => {
    const [showError, setShowError] = useState(false);  // Estado para manejar errores de inicio de sesión
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // Estado para mostrar el modal de éxito

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Recoger los valores de los campos del formulario y convertirlos en formData
        const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
        };
        //Realizar la solicitud de inicio de sesion a /login
        try {
            const response = await fetch('https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),//convertir el formData en JSON
            });

            if (response.ok) {
                console.log("Inicio de sesión exitoso");
                setShowSuccessModal(true);  // Mostrar modal de éxito
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
                        required
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

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="success-modal">
                    <div className="success-modal-content">
                        <h3>¡Inicio de sesión exitoso!</h3>
                        <p>Has iniciado sesión correctamente.</p>
                        <button className="btn-close-success" onClick={() => {
                            setShowSuccessModal(false);
                            setShowModal(false);  // Cerrar modal de éxito y modal principal
                        }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
