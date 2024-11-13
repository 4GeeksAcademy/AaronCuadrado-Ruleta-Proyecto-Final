import React, { useState, useEffect, useContext } from "react";
import { Navbar } from "../component/Navbar";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { store, actions } = useContext(Context); // Acceder a store para obtener datos del usuario
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isEditing, setIsEditing] = useState(false); // Para controlar si está en modo edición
    const navigate = useNavigate();

    // Cargar información del usuario al cargar el componente
    useEffect(() => {
        if (!store.user) {
            // Redirigir si el usuario no está autenticado
            navigate("/");
        }
    }, [store, navigate]);

    const handleUsernameChange = async (e) => {
        e.preventDefault();

        if (!newUsername || newUsername === store.user.username) {
            setUsernameError("El nuevo nombre de usuario no puede estar vacío ni ser el mismo.");
            return;
        }

        // Enviar solicitud para cambiar el nombre de usuario
        try {
            const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/users/" + store.user.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (response.ok) {
                const data = await response.json();
                actions.updateUser(data);  // Actualizar usuario en el contexto global
                setIsEditing(false);
            } else {
                const data = await response.json();
                setUsernameError(data.error || "Error al cambiar el nombre de usuario.");
            }
        } catch (error) {
            console.error("Error al cambiar el nombre de usuario:", error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword) {
            setPasswordError("Ambos campos son obligatorios.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Enviar solicitud para cambiar la contraseña
        try {
            const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/users/" + store.user.id + "/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                setCurrentPassword("");
                setNewPassword("");
                setPasswordError("");  // Limpiar el error
            } else {
                const data = await response.json();
                setPasswordError(data.error || "Error al cambiar la contraseña.");
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                <div className="profile-header">
                    <h1>Mi Perfil</h1>
                </div>
                <div className="profile-details">
                    <p><strong>Nombre de Usuario:</strong> {store.user.username}</p>
                    <p><strong>Email:</strong> {store.user.email}</p>
                    <p><strong>Saldo:</strong> {store.user.balance} €</p>
                    {/* Aquí podrías añadir medallas o logros */}
                </div>

                <div className="profile-actions">
                    <button onClick={() => setIsEditing(true)} className="edit-button">
                        Editar Nombre de Usuario
                    </button>

                    {/* Formulario para editar el nombre de usuario */}
                    {isEditing && (
                        <form onSubmit={handleUsernameChange}>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Nuevo nombre de usuario"
                                required
                            />
                            {usernameError && <p className="error-message">{usernameError}</p>}
                            <button type="submit">Guardar Cambios</button>
                            <button onClick={() => setIsEditing(false)}>Cancelar</button>
                        </form>
                    )}
                </div>

                <div className="profile-actions">
                    <h2>Cambiar Contraseña</h2>
                    <form onSubmit={handlePasswordChange}>
                        <input
                            type="password"
                            placeholder="Contraseña Actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <button type="submit">Cambiar Contraseña</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
