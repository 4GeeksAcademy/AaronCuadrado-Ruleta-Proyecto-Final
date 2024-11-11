// src/component/RouletteTable.js
import React from 'react';
import '../../styles/roulette/RouletteTable.css';

const getColorForAmount = (amount) => {
    switch (amount) {
        case 0.2: return "#D3D3D3";
        case 0.5: return "#B3B3B3";
        case 1: return "#FFD700";
        case 2: return "#00FF00";
        case 5: return "#0000FF";
        case 10: return "#FF4500";
        case 25: return "#800080";
        case 50: return "#FFFF00";
        case 100: return "#A52A2A";
        default: return "#FFD700";
    }
};

const RouletteTable = ({ onPlaceBet, bets }) => {
    const numbers = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    ];

    const renderNumberTile = (number) => {
        let colorClass = '';
        if (number === 0) colorClass = 'green';
        else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)) colorClass = 'red';
        else colorClass = 'black';

        // Mostrar la ficha en la casilla de número si hay una apuesta en ese número
        const bet = bets.find((bet) => bet.value === number);
        const betAmount = bet ? bet.amount : null;

        return (
            <div
                key={number}
                className={`number-tile ${colorClass}`}
                onClick={() => onPlaceBet("number", number)}
            >
                {number}
                {betAmount && (
                    <div
                        className="chip-icon"
                        style={{
                            backgroundColor: getColorForAmount(betAmount),
                        }}
                    >
                        {betAmount}€
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="roulette-table-container">
            <div className="number-row">
                {renderNumberTile(0)}
            </div>
            {numbers.map((row, rowIndex) => (
                <div key={rowIndex} className="number-row">
                    {row.map((number) => renderNumberTile(number))}
                </div>
            ))}
            <div className="bet-options">
                <button className="bet-option-button pares" onClick={() => onPlaceBet('pares')}>PARES</button>
                <button className="bet-option-button rojo" onClick={() => onPlaceBet('rojo')}>ROJO</button>
                <button className="bet-option-button negro" onClick={() => onPlaceBet('negro')}>NEGRO</button>
                <button className="bet-option-button impares" onClick={() => onPlaceBet('impares')}>IMPARES</button>
            </div>
        </div>
    );
};

export default RouletteTable;
