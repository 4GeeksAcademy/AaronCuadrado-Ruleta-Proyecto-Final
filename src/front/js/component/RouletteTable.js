// src/component/RouletteTable.js
import React, { useState } from "react";
import "../../styles/roulette/RouletteTable.css";

export const RouletteTable = ({ onPlaceBet }) => {
    const [selectedBet, setSelectedBet] = useState(null);

    const placeBet = (bet) => {
        setSelectedBet(bet);
        onPlaceBet(bet);
    };

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    const rouletteNumbers = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ];

    return (
        <div className="roulette-table">
            <div className="row zero">
                <div className="cell green" onClick={() => placeBet("0")}>0</div>
            </div>
            {rouletteNumbers.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {row.map((number) => {
                        const colorClass = redNumbers.includes(number) ? "red" : blackNumbers.includes(number) ? "black" : "";
                        return (
                            <div key={number} className={`cell ${colorClass}`} onClick={() => placeBet(number)}>
                                {number}
                            </div>
                        );
                    })}
                </div>
            ))}
            <div className="row special-options">
                <div className="cell" onClick={() => placeBet("even")}>PARES</div>
                <div className="cell red" onClick={() => placeBet("red")}>ROJO</div>
                <div className="cell black" onClick={() => placeBet("black")}>NEGRO</div>
                <div className="cell" onClick={() => placeBet("odd")}>IMPARES</div>
            </div>
        </div>
    );
};
