// src/component/RouletteWheel.js
import React, { useState, useEffect } from 'react';
import '../../styles/roulette/RouletteWheel.css';

const RouletteWheel = ({ spinAngle }) => {
    return (
        <div className="roulette-wheel-container">
            <div className="roulette-wheel" style={{ transform: `rotate(${spinAngle}deg)` }}>
                {[...Array(37)].map((_, i) => (
                    <div key={i} className={`roulette-number ${i % 2 === 0 ? 'black' : 'red'} ${i === 0 ? 'green' : ''}`} style={{ transform: `rotate(${i * 9.73}deg)` }}>
                        {i}
                    </div>
                ))}
            </div>
            <div className="roulette-pointer"></div>
        </div>
    );
};

export default RouletteWheel;
