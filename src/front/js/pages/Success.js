import "../../styles/success.css";
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Success = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        // Llamar a updateBalance para obtener el saldo actualizado
        actions.updateBalance();
    }, [actions]);

    const handleNavigate = () => {
        if (store.isAuthenticated) {
            navigate("/menu");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="success-container">
            <h2>¡Pago completado con éxito!</h2>
            <p>Tu saldo ha sido recargado.</p>
            <button onClick={handleNavigate}>Volver al Menú Principal</button>
        </div>
    );
};
