// src/js/pages/Roulette.js
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "../component/Navbar";
import "../../styles/roulette.css";

export const Roulette = () => {
    const { store, actions } = useContext(Context);
    const [selectedBet, setSelectedBet] = useState(null); // Almacena la ficha seleccionada
    const [betAmount, setBetAmount] = useState(0); // Monto de la apuesta

    // Lista de fichas de apuestas
    const chips = [0.2, 0.5, 1, 2, 5, 10, 25, 50, 100];

    // Función para seleccionar una ficha de apuesta
    const handleSelectChip = (chip) => {
        setSelectedBet(chip);
    };

    // Función para manejar la apuesta
    const handlePlaceBet = async (betType) => {
        if (selectedBet === null) {
            alert("Selecciona una ficha para apostar");
            return;
        }

        try {
            const response = await fetch("https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/bet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    amount: selectedBet,
                    type: betType, // "number", "color", "even", "odd", etc.
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Resultado: ${data.result}. Ganancias: ${data.payout} €`);
                actions.updateBalance(); // Actualiza el balance después de la apuesta
            } else {
                alert(data.error || "Error en la apuesta");
            }
        } catch (error) {
            console.error("Error al realizar la apuesta:", error);
        }
    };

    return (
        <div className="roulette-page">
            <Navbar />
            <div className="roulette-container">
                <h2>La Ruleta Dorada</h2>
                
                {/* Ruleta interactiva */}
                <div className="roulette-wheel">
                    
                </div>
                
                {/* Fichas de apuestas */}
                <div className="bet-chips">
                    {chips.map((chip, index) => (
                        <button
                            key={index}
                            className={`chip ${selectedBet === chip ? "selected" : ""}`}
                            onClick={() => handleSelectChip(chip)}
                        >
                            €{chip}
                        </button>
                    ))}
                </div>

                {/* Botones de apuesta */}
                <div className="bet-options">
                    <button onClick={() => handlePlaceBet("number")}>Apostar a Número</button>
                    <button onClick={() => handlePlaceBet("color")}>Apostar a Color</button>
                    <button onClick={() => handlePlaceBet("even")}>Apostar a Par</button>
                    <button onClick={() => handlePlaceBet("odd")}>Apostar a Impar</button>
                </div>
            </div>
        </div>
    );
};
