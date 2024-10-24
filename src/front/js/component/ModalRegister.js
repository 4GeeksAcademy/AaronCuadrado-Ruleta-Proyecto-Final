import React, { useState } from "react";
import "../../styles/modalRegister.css";  // Estilos del modal

export const ModalRegister = ({ setShowModal }) => {
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);  // Estado para mostrar el mensaje de ayuda
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // Estado para el modal de confirmación


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Usuario registrado exitosamente");
                setShowSuccessModal(true);  // Mostrar modal de éxito
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Correo electrónico:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onFocus={() => setShowPasswordInfo(true)}  // Mostrar información al enfocar
                       
                    />

                    {showPasswordInfo && (
                        <p className="password-info">
                            La contraseña debe tener al menos 6 caracteres.
                        </p>
                    )}

                    <button type="submit" className="btn-submit">Registrarse</button>
                </form>
                <button onClick={() => setShowModal(false)} className="btn-close">
                </button>
            </div>
            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="success-modal">
                    <div className="success-modal-content">
                        <h3>¡Registro exitoso!</h3>
                        <p>El usuario ha sido registrado correctamente.</p>
                        <button className="btn-close-success" onClick={() => setShowSuccessModal(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
