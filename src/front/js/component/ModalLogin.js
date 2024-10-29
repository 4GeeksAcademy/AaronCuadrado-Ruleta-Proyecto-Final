import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modalLogin.css";
import { Context } from "../store/appContext"; 

export const ModalLogin = ({ setShowModal }) => {
    // Accede a las acciones de flux
    const { actions } = useContext(Context); 
    //Estado para mostrar mensaje de error 
    const [showError, setShowError] = useState(false);
    //Estado para mostrar modal de exito
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    //Hook para navegar a diferentes rutas
    const navigate = useNavigate();

    //Manejar el envio del formulario de inicio de sesion
    const handleSubmit = async (e) => {
        e.preventDefault(); //prevenir el comportamiento predeterminado del formulario

        //Recoger los datos del formulario para el inicio de sesion
        const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
        };

        try {
            // Realizar la peticion de inicio de sesion a la API /login
            const response = await fetch('https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), //convertir los datos a JSON para enviarlos
            });
            
            //verificar si la respuesta de la API es exitosa
            if (response.ok) {
                const data = await response.json(); // Obtener datos de saldo
                actions.login(data.balance); // Llama a la acción login para actualizar el estado global
                setShowSuccessModal(true);  // Muestra el modal de éxito
            } else {
                const errorData = await response.json(); //Si hay un error, obtiene el mensaje de error
                console.error(errorData.error);
                setShowError(true); //Muestra el mensaje de error en la interfaz
            }
        } catch (error) {
            console.error("Error:", error); //Captura y muestra cualquier error que ocurra
            setShowError(true); //Muestra el mensaje de error si falla la conexion
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
                    
                    {/* Modal de error por añadir credenciales incorrectas */}
                    {showError && (
                        <p className="error-message">
                            Usuario o contraseña incorrectos.
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>
                {/* Boton para cerrar el modal con la X */}
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
                            setShowSuccessModal(false); //Oculta el modal de exito
                            setShowModal(false); //Cierra el modal de inicio de sesion
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
