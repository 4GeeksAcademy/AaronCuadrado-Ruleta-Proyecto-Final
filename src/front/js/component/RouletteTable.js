// src/component/RouletteTable.js
import React from 'react';
import '../../styles/roulette/RouletteTable.css';

const RouletteTable = ({ onPlaceBet }) => {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    return (
        <div className="roulette-table">
            <div className="roulette-row">
                <div className="roulette-cell green" onClick={() => onPlaceBet(0)}>0</div>
                {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
                    <div
                        key={num}
                        className={`roulette-cell ${redNumbers.includes(num) ? 'red' : blackNumbers.includes(num) ? 'black' : ''}`}
                        onClick={() => onPlaceBet(num)}
                    >
                        {num}
                    </div>
                ))}
            </div>
            <div className="bet-options">
                <button className="bet-option" onClick={() => onPlaceBet('PARES')}>PARES</button>
                <button className="bet-option red" onClick={() => onPlaceBet('ROJO')}>ROJO</button>
                <button className="bet-option black" onClick={() => onPlaceBet('NEGRO')}>NEGRO</button>
                <button className="bet-option" onClick={() => onPlaceBet('IMPARES')}>IMPARES</button>
            </div>
        </div>
    );
};

export default RouletteTable;
