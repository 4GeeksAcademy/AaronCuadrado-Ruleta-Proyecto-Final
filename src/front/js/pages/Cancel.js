import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/cancel.css";

export const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="cancel-container">
            <h2>Pago Cancelado</h2>
            <p>Has cancelado el proceso de pago. Vuelve a intentarlo.</p>
            <button onClick={() => navigate("/add-funds")}>Intentar de Nuevo</button>
        </div>
    );
};
