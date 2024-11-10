// src/component/RouletteWheel.js
import React, { useState } from 'react';
import '../../styles/roulette/RouletteWheel.css';

const RouletteWheel = ({ spinAngle }) => {
    const numbers = [
        { number: 0, color: 'green' },
        { number: 32, color: 'red' },
        { number: 15, color: 'black' },
        { number: 19, color: 'red' },
        { number: 4, color: 'black' },
        { number: 21, color: 'red' },
        { number: 2, color: 'black' },
        { number: 25, color: 'red' },
        { number: 17, color: 'black' },
        { number: 34, color: 'red' },
        { number: 6, color: 'black' },
        { number: 27, color: 'red' },
        { number: 13, color: 'black' },
        { number: 36, color: 'red' },
        { number: 11, color: 'black' },
        { number: 30, color: 'red' },
        { number: 8, color: 'black' },
        { number: 23, color: 'red' },
        { number: 10, color: 'black' },
        { number: 5, color: 'red' },
        { number: 24, color: 'black' },
        { number: 16, color: 'red' },
        { number: 33, color: 'black' },
        { number: 1, color: 'red' },
        { number: 20, color: 'black' },
        { number: 14, color: 'red' },
        { number: 31, color: 'black' },
        { number: 9, color: 'red' },
        { number: 22, color: 'black' },
        { number: 18, color: 'red' },
        { number: 29, color: 'black' },
        { number: 7, color: 'red' },
        { number: 28, color: 'black' },
        { number: 12, color: 'red' },
        { number: 35, color: 'black' },
        { number: 3, color: 'red' },
        { number: 26, color: 'black' }
    ];

    return (
        <div className="roulette-wheel-container">
            <div className="roulette-wheel" style={{ transform: `rotate(${spinAngle}deg)` }}>
                {numbers.map((item, index) => (
                    <div
                        key={index}
                        className={`roulette-number ${item.color}`}
                        style={{
                            transform: `rotate(${index * (360 / 37)}deg) translate(0, -130px)`,
                        }}
                    >
                        {item.number}
                    </div>
                ))}
            </div>
            <div className="roulette-pointer"></div>
        </div>
    );
};

export default RouletteWheel;
