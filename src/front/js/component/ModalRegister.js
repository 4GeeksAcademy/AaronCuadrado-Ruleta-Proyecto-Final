import React, { useState } from "react";
import "../../styles/modal/modalregister.css"; // Archivo de estilos específico para el modal

// Componente funcional para el modal de registro
export const ModalRegister = ({ onClose }) => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Estado para almacenar los mensajes de error
    const [errors, setErrors] = useState({});

    // Maneja los cambios en los campos del formulario
    const handleInputChange = (e) => {
        setFormData({
            ...formData, // Mantiene los valores actuales
            [e.target.name]: e.target.value // Actualiza el campo correspondiente
        });
    };

    // Función para validar los datos del formulario
    const validateForm = () => {
        const errors = {}; // Objeto para almacenar los errores
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el email

        if (!formData.username) errors.username = "El nombre de usuario es obligatorio"; // Validación del nombre de usuario
        if (!formData.email || !emailRegex.test(formData.email)) errors.email = "Email inválido"; // Validación del email
        if (formData.password.length < 6)
            errors.password = "La contraseña debe tener al menos 6 caracteres"; // Validación de longitud mínima de la contraseña
        if (formData.password !== formData.confirmPassword)
            errors.confirmPassword = "Las contraseñas no coinciden"; // Validación de coincidencia de contraseñas

        return errors; // Devuelve los errores encontrados
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        const validationErrors = validateForm(); // Llama a la función de validación
        if (Object.keys(validationErrors).length > 0) {
            // Si hay errores, los almacena en el estado
            setErrors(validationErrors);
        } else {
            // Si no hay errores, procesa los datos
            console.log("Formulario enviado", formData);
            setErrors({}); // Limpia los errores
            // Aquí puedes enviar los datos al backend
            onClose(); // Cierra el modal
        }
    };

    // Renderiza el modal
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Botón para cerrar el modal */}
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Registro</h2>
                {/* Formulario de registro */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        {/* Muestra el mensaje de error si existe */}
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && (
                            <p className="error-message">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <button type="submit" className="submit-button">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};
