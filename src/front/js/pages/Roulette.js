// src/js/pages/Roulette.js
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "../component/Navbar";
import "../../styles/roulette/roulette.css";
import "../../styles/roulette/chip.css";

export const Roulette = () => {
    const { store, actions } = useContext(Context);
    const [selectedBet, setSelectedBet] = useState(null);
    const [betType, setBetType] = useState(null);
    const [betValue, setBetValue] = useState(null);
    const [message, setMessage] = useState("");

    // Lista de valores de fichas
    const chips = [0.2, 0.5, 1, 2, 5, 10, 25, 50, 100];

    const numbers = [
        { value: 0, color: "green" },
        { value: 32, color: "red" }, { value: 15, color: "black" },
        { value: 19, color: "red" }, { value: 4, color: "black" },
        { value: 21, color: "red" }, { value: 2, color: "black" },
        { value: 25, color: "red" }, { value: 17, color: "black" },
        { value: 34, color: "red" }, { value: 6, color: "black" },
        { value: 27, color: "red" }, { value: 13, color: "black" },
        { value: 36, color: "red" }, { value: 11, color: "black" },
        { value: 30, color: "red" }, { value: 8, color: "black" },
        { value: 23, color: "red" }, { value: 10, color: "black" },
        { value: 5, color: "red" }, { value: 24, color: "black" },
        { value: 16, color: "red" }, { value: 33, color: "black" },
        { value: 1, color: "red" }, { value: 20, color: "black" },
        { value: 14, color: "red" }, { value: 31, color: "black" },
        { value: 9, color: "red" }, { value: 22, color: "black" },
        { value: 18, color: "red" }, { value: 29, color: "black" },
        { value: 7, color: "red" }, { value: 28, color: "black" },
        { value: 12, color: "red" }, { value: 35, color: "black" },
        { value: 3, color: "red" }, { value: 26, color: "black" },
    ];

    const handleSelectChip = (e, value) => {
        e.dataTransfer.setData("chipValue", value);
        setSelectedBet(value);
    };

    const handleDrop = async (e, area, value) => {
        e.preventDefault();
        const chipValue = parseFloat(e.dataTransfer.getData("chipValue"));
        setBetType(area);
        setBetValue(value);

        try {
            const response = await fetch("https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/api/bet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    amount: chipValue,
                    bet_type: area,
                    bet_value: value,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                actions.updateBalance();
            } else {
                alert(data.error || "Error en la apuesta");
            }
        } catch (error) {
            console.error("Error al realizar la apuesta:", error);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div className="roulette-page">
            <Navbar />
            <div className="roulette-container">
                <h2>La Ruleta Dorada</h2>

                {/* Ruleta visual completa */}
                <div className="roulette-wheel">
                    {numbers.map((number, index) => (
                        <div
                            key={index}
                            className={`number ${number.color}`}
                            style={{
                                transform: `rotate(${(index * 360) / numbers.length}deg) translate(0, -180px)`,
                            }}
                            onDrop={(e) => handleDrop(e, "number", number.value)}
                            onDragOver={handleDragOver}
                        >
                            {number.value}
                        </div>
                    ))}
                </div>

                {/* Opciones de apuestas de color y paridad */}
                <div className="bet-options">
                    <div
                        className="bet-zone red"
                        onDrop={(e) => handleDrop(e, "color", "red")}
                        onDragOver={handleDragOver}
                    >
                        Rojo
                    </div>
                    <div
                        className="bet-zone black"
                        onDrop={(e) => handleDrop(e, "color", "black")}
                        onDragOver={handleDragOver}
                    >
                        Negro
                    </div>
                    <div
                        className="bet-zone even"
                        onDrop={(e) => handleDrop(e, "parity", "pares")}
                        onDragOver={handleDragOver}
                    >
                        Pares
                    </div>
                    <div
                        className="bet-zone odd"
                        onDrop={(e) => handleDrop(e, "parity", "impares")}
                        onDragOver={handleDragOver}
                    >
                        Impares
                    </div>
                </div>

                {/* Fichas de apuestas */}
                <div className="bet-chips">
                    {chips.map((chip, index) => (
                        <div
                            key={index}
                            className={`chip chip-${chip.toString().replace(".", "-")}`}
                            draggable
                            onDragStart={(e) => handleSelectChip(e, chip)}
                        >
                            €{chip}
                        </div>
                    ))}
                </div>

                {/* Mensaje de resultado */}
                {message && <div className="bet-result">{message}</div>}
            </div>
        </div>
    );
};
