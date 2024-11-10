// src/component/Chips.js
import React from "react";
import "../../styles/roulette/Chips.css";

export const Chips = ({ onAmountSelect }) => {
    const handleChipClick = (amount) => {
        onAmountSelect(amount);
    };

    const chips = [
        { value: 0.2, color: "#C0C0C0" }, // Plateado
        { value: 0.5, color: "#808080" }, // Gris
        { value: 1, color: "#D4AF37" }, // Dorado
        { value: 2, color: "#32CD32" }, // Verde
        { value: 5, color: "#1E90FF" }, // Azul
        { value: 10, color: "#FF4500" }, // Naranja/Rojo
        { value: 25, color: "#800080" }, // Púrpura
        { value: 50, color: "#FFD700" }, // Amarillo dorado
        { value: 100, color: "#8B4513" }, // Marrón
    ];

    return (
        <div className="chips-container">
            {chips.map((chip, index) => (
                <button
                    key={index}
                    className="chip"
                    style={{ backgroundColor: chip.color }}
                    onClick={() => handleChipClick(chip.value)}
                >
                    {chip.value}€
                </button>
            ))}
        </div>
    );
};

export default Chips;
