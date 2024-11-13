import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "../component/Navbar";

// Componente de retirada de fondos
export const WithdrawFunds = () => {
    const { store, actions } = useContext(Context); // Obtener estado global y las acciones
    const [amount, setAmount] = useState(""); // Estado para almacenar la cantidad que el usuario quiere retirar
    const [message, setMessage] = useState(""); // Estado para mostrar mensajes al usuario

    // Función que se ejecuta al hacer clic en el botón de retirada
    const handleWithdraw = async () => {
        const parsedAmount = parseFloat(amount);

        // Validación para verificar que la cantidad sea positiva y no supere el balance del usuario
        if (parsedAmount <= 0 || parsedAmount > store.userBalance) {
            setMessage("Cantidad no válida o saldo insuficiente");
            return;
        }

        try {
            // Solicitud al backend para la retirada
            const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/withdraw-funds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ amount: parsedAmount })
            });

            // Si la respuesta es exitosa
            if (response.ok) {
                const data = await response.json(); // Convierte la respuesta en JSON
                setMessage(data.message); // Muestra el mensaje de éxito
                actions.updateBalance(data.new_balance); // Actualiza el balance
                setAmount(""); // Limpia el campo de cantidad
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || "Error en la retirada");
            }
        } catch (error) {
            setMessage("Hubo un error al procesar la solicitud");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="withdraw-container">
                <h2>Retirar Fondos</h2>
                <p>Saldo disponible: {store.userBalance.toFixed(2)} €</p>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Cantidad a retirar"
                    min="0"
                    step="0.01"
                />

                <button onClick={handleWithdraw}>Confirmar retirada</button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};
