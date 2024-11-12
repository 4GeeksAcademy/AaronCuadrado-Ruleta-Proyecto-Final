import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/navbar-options/add-funds.css";

export const AddFunds = () => {
    const { actions } = useContext(Context);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);

    const handleAddFunds = async () => {
        try {
            const response = await fetch("https://ominous-fishstick-g4x796gg6wr4fwp47-3001.app.github.dev/api/add-funds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ amount }),
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.stripe_url; // Redirige a la URL de pago de Stripe
            } else {
                const data = await response.json();
                setError(data.error || "Error al procesar la recarga de saldo.");
            }
        } catch (err) {
            setError("Hubo un problema al conectar con el servidor.");
        }
    };

    return (
        <div className="add-funds">
            <h2>Recargar Saldo</h2>
            <input
                type="number"
                placeholder="Monto en €"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleAddFunds}>Añadir Fondos</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};
