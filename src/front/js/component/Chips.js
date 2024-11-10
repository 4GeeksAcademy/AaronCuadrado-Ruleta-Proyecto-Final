// src/component/Chips.js
import React from "react";
import "../../styles/roulette/Chips.css";

export const Chips = ({ onAmountSelect, onConfirmBet }) => {
    const handleChipClick = (amount) => {
        onAmountSelect(amount);
    };

    return (
        <div className="chips-container">
            <button className="chip" data-value="0.2" onClick={() => handleChipClick(0.2)}>0.2€</button>
            <button className="chip" data-value="0.5" onClick={() => handleChipClick(0.5)}>0.5€</button>
            <button className="chip" data-value="1" onClick={() => handleChipClick(1)}>1€</button>
            <button className="chip" data-value="2" onClick={() => handleChipClick(2)}>2€</button>
            <button className="chip" data-value="5" onClick={() => handleChipClick(5)}>5€</button>
            <button className="chip" data-value="10" onClick={() => handleChipClick(10)}>10€</button>
            <button className="chip" data-value="25" onClick={() => handleChipClick(25)}>25€</button>
            <button className="chip" data-value="50" onClick={() => handleChipClick(50)}>50€</button>
            <button className="chip" data-value="100" onClick={() => handleChipClick(100)}>100€</button>
            <button className="confirm-bet" onClick={onConfirmBet}>Confirmar Apuesta</button>
        </div>
    );
};

export default Chips;
