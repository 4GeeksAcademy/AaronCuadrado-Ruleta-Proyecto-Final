// src/pages/Roulette.js
import React, { useState } from "react";
import RouletteWheel from "../component/RouletteWheel";
import RouletteTable from "../component/RouletteTable";
import Chips from "../component/Chips";
import "../../styles/roulette/roulette.css";

export const Roulette = () => {
    const [spinAngle, setSpinAngle] = useState(0);

    const startSpin = () => {
        const angle = Math.floor(Math.random() * 360) + 720;
        setSpinAngle(angle);
    };

    return (
        <div className="roulette-game">
            <RouletteWheel spinAngle={spinAngle} />
            <button onClick={startSpin} className="spin-button">Girar Ruleta</button>
            <RouletteTable />
            <Chips />
        </div>
    );
};
