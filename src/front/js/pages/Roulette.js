// src/pages/Roulette.js
import React, { useState, useContext } from "react";
import { RouletteTable } from "../component/RouletteTable";
import { Chips } from "../component/Chips";
import { Navbar } from "../component/Navbar";
import { Context } from "../store/appContext"; // Importa el contexto
import "../../styles/roulette/roulette.css";

const Roulette = () => {
    const { store, actions } = useContext(Context); // Usa el contexto aquí
    const [betAmount, setBetAmount] = useState(0);
    const [betSelection, setBetSelection] = useState(null);
    const [resultMessage, setResultMessage] = useState("");

    const handlePlaceBet = (bet) => {
        setBetSelection(bet);
    };

    const handleAmountSelect = (amount) => {
        setBetAmount(amount);
    };

    const handleConfirmBet = async () => {
        if (betSelection && betAmount > 0) {
            try {
                const response = await fetch(`https://cuddly-space-capybara-4jqw46xx6v46fvv7-3001.app.github.dev/api/bet`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: betAmount,
                        bet_type: typeof betSelection === "number" ? "number" : betSelection, 
                        bet_value: betSelection,
                    }),
                    credentials: "include",
                });

                const data = await response.json();
                if (response.ok) {
                    setResultMessage(data.message);
                    actions.updateBalance(); // Actualiza el balance después de la apuesta
                } else {
                    setResultMessage(data.error || "Hubo un error al realizar la apuesta.");
                }
            } catch (error) {
                setResultMessage("Error al conectar con el servidor.");
            }
        } else {
            alert("Por favor, selecciona una cantidad y un número para apostar.");
        }
    };

    return (
        <div className="roulette-page">
            <Navbar />
            <RouletteTable onPlaceBet={handlePlaceBet} />
            <Chips onAmountSelect={handleAmountSelect} onConfirmBet={handleConfirmBet} />
            <div className="current-bet">
                <p>Apuesta: {betSelection}</p>
                <p>Cantidad: {betAmount}€</p>
                {resultMessage && <p>Resultado: {resultMessage}</p>}
            </div>
        </div>
    );
};

export default Roulette;
