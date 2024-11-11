// src/pages/Roulette.js
import React, { useState, useEffect, useContext } from "react";
import { Navbar } from "../component/Navbar";
import RouletteTable from "../component/RouletteTable";
import Chips from "../component/Chips";
import { Context } from "../store/appContext";
import "../../styles/roulette/Roulette.css";

export const Roulette = () => {
    const { store, actions } = useContext(Context);
    const [selectedBetType, setSelectedBetType] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [betAmount, setBetAmount] = useState(0);
    const [timer, setTimer] = useState(10);
    const [winningNumber, setWinningNumber] = useState(null);
    const [winningColor, setWinningColor] = useState(null);
    const [bets, setBets] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [lastTenNumbers, setLastTenNumbers] = useState([]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    generateWinningNumber();
                }
                return prev > 0 ? prev - 1 : 10;
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const generateWinningNumber = () => {
        const randomNumber = Math.floor(Math.random() * 37);
        setWinningNumber(randomNumber);

        const color = getColorForNumber(randomNumber);
        setWinningColor(color);

        setLastTenNumbers((prevNumbers) => {
            const updatedNumbers = [randomNumber, ...prevNumbers];
            return updatedNumbers.slice(0, 10);
        });

        calculateResult(randomNumber, color);
    };

    const getColorForNumber = (number) => {
        if (number === 0) return "green";
        if ([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(number)) return "black";
        return "red";
    };

    const handleSelectAmount = (amount) => {
        setBetAmount(amount);
        setErrorMessage("");
    };

    const handlePlaceBet = (type, value) => {
        if (betAmount > store.userBalance) {
            setErrorMessage("Saldo insuficiente para realizar esta apuesta.");
            return;
        }

        setSelectedBetType(type);
        setSelectedValue(value);
        setErrorMessage("");

        setBets((prevBets) => [
            ...prevBets,
            { type, value, amount: betAmount }
        ]);
    };

    const submitBet = async () => {
        if (betAmount > store.userBalance) {
            setErrorMessage("Saldo insuficiente para aceptar la apuesta.");
            return;
        }

        if (betAmount > 0 && selectedBetType && selectedValue !== null) {
            try {
                const response = await fetch('https://cuddly-space-capybara-4jqw46xx6v46fvv7-3001.app.github.dev/api/bet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: betAmount,
                        bet_type: selectedBetType,
                        bet_value: selectedValue
                    }),
                });
                const data = await response.json();
                actions.updateBalance(data.new_balance);
                setResultMessage("");
                setBetAmount(0);
                setSelectedBetType(null);
                setSelectedValue(null);
                setErrorMessage("");
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            setErrorMessage("No hay apuesta válida para enviar.");
        }
    };

    const handleClearBet = () => {
        setBetAmount(0);
        setSelectedBetType(null);
        setSelectedValue(null);
        setBets([]);
        setErrorMessage("");
        setResultMessage("");
    };

    const calculateResult = (winningNumber, winningColor) => {
        let totalWin = 0;
        let totalBet = 0;

        bets.forEach((bet) => {
            totalBet += bet.amount;

            if (
                (bet.type === "number" && bet.value === winningNumber) ||
                (bet.type === "color" && bet.value === winningColor)
            ) {
                totalWin += bet.amount * 2; // Multiplica la apuesta ganadora (ajusta el multiplicador según el tipo de apuesta)
            }
        });

        if (totalWin > 0) {
            setResultMessage(`¡Has ganado ${totalWin}€!`);
            actions.updateBalance(store.userBalance + totalWin);
        } else {
            setResultMessage("Has perdido esta ronda.");
            actions.updateBalance(store.userBalance - totalBet);
        }
    };

    return (
        <div className="roulette-game">
            <Navbar />
            <RouletteTable onPlaceBet={handlePlaceBet} bets={bets} />
            <Chips onSelectAmount={handleSelectAmount} />
            <div className="controls">
                <button onClick={() => setBetAmount(betAmount * 2)}>Duplicar Apuesta</button>
                <button onClick={handleClearBet}>Borrar Apuestas</button>
                <button onClick={submitBet}>Aceptar Apuestas</button>
            </div>
            <div>Tiempo restante para apostar: {timer}s</div>
            <div>Apuestas actuales: {bets.reduce((sum, bet) => sum + bet.amount, 0)}€</div>
            <ul>
                {bets.map((bet, index) => (
                    <li key={index}>
                        {bet.amount}€ en {bet.type} {bet.value}
                    </li>
                ))}
            </ul>
            {winningNumber !== null && (
                <div className="winning-number" style={{ backgroundColor: winningColor }}>
                    {winningNumber}
                </div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {resultMessage && <div className="result-message">{resultMessage}</div>}
            <div className="last-ten-numbers">
                Últimos 10 números: {lastTenNumbers.join(", ")}
            </div>
        </div>
    );
};
