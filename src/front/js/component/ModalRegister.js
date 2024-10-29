import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modalRegister.css";
import { Context } from "../store/appContext";  

export const ModalRegister = ({ setShowModal }) => {
    const { actions } = useContext(Context);  // Accede a las acciones de flux
    const [showError, setShowError] = useState(false);  // Estado para manejar errores de registro
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // Estado para mostrar el modal de éxito
    const [passwordError, setPasswordError] = useState(""); //estado para el mensaje de error de contraseña
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Recoger los valores del formulario de registro y convertirlos en formData
        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        //Validacion de contraseña
        if(formData.password.length <6) {
            setPasswordError("La contraseña debe tener al menos 6 caracteres");
            return;
        } else {
            setPasswordError("");
        }

        try {
            // Realizar la solicitud de registro a /register en el backend
            const response = await fetch('https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json(); // Obtener datos como el saldo inicial
                actions.login(data.balance); // Llama a la acción login para actualizar el estado global
                setShowSuccessModal(true);  // Mostrar modal de éxito
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                setShowError(true);  // Mostrar mensaje de error
            }
        } catch (error) {
            console.error("Error:", error); //muestra cualquier error en la solicitud
            setShowError(true); //Muestra el mensaje de error si ocurre una excepcion
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required />

                    {passwordError && <p className="error-message">{passwordError}</p>}
                   
                    {/* Mostrar mensaje de error si el registro falla */}
                    {showError && (
                        <p className="error-message">
                            Hubo un error al registrarse. Inténtalo de nuevo.
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Registrarse</button>
                </form>
                {/* Botón para cerrar el modal de registro */}
                <button onClick={() => setShowModal(false)} className="btn-close">
                </button>
            </div>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="success-modal">
                    <div className="success-modal-content">
                        <h3>¡Registro exitoso!</h3>
                        <p>Te has registrado correctamente.</p>
                        <button className="btn-close-success" onClick={() => {
                            setShowSuccessModal(false);
                            setShowModal(false);  // Cerrar modal de éxito y modal principal
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
