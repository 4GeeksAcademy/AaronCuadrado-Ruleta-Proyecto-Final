import React, { useState, useEffect } from "react";
import '../../styles/blackjack/Blackjack.css'

const Blackjack = () => {
    const [balance, setBalance] = useState(0);
    const [betAmount, setBetAmount] = useState(0);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [message, setMessage] = useState("");
    const [gameInProgress, setGameInProgress] = useState(false);

    // Obtener el balance al cargar el componente
    useEffect(() => {
        fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/get_balance", {
            method: "GET",
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => setBalance(data.balance))
        .catch((error) => console.error("Error al obtener el balance:", error));
    }, []);

    const handleBet = () => {
        fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/bet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ amount: betAmount }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                setMessage(data.error);
            } else {
                setPlayerHand(data.player_hand);
                setDealerHand(data.dealer_hand);
                setPlayerScore(data.player_score);
                setBalance(data.new_balance);
                setMessage(data.message);
                setGameInProgress(true);
            }
        })
        .catch((error) => console.error("Error al realizar la apuesta:", error));
    };

    const handleHit = () => {
        fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/hit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ player_hand: playerHand, dealer_hand: dealerHand }),
        })
        .then((response) => response.json())
        .then((data) => {
            setPlayerHand(data.player_hand);
            setPlayerScore(data.player_score);
            setMessage(data.message);
            if (data.player_score > 21) setGameInProgress(false); // Termina el juego si se pasa de 21
        })
        .catch((error) => console.error("Error al pedir carta:", error));
    };

    const handleStand = () => {
        fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/stand", { // URL corregida aquí
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ player_hand: playerHand, dealer_hand: dealerHand, amount: betAmount }),
        })
        .then((response) => response.json())
        .then((data) => {
            setDealerHand(data.dealer_hand);
            setDealerScore(data.dealer_score);
            setBalance(data.new_balance);
            setMessage(data.message);
            setGameInProgress(false); // Termina el juego al plantarse
        })
        .catch((error) => console.error("Error al plantarse:", error));
    };

    const handleDoubleDown = () => {
        fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/double", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ amount: betAmount, player_hand: playerHand }),
        })
        .then((response) => response.json())
        .then((data) => {
            setPlayerHand(data.player_hand);
            setPlayerScore(data.player_score);
            setBalance(data.new_balance);
            setMessage(data.message);
            if (data.player_score > 21) setGameInProgress(false); // Termina el juego si se pasa de 21
        })
        .catch((error) => console.error("Error al duplicar la apuesta:", error));
    };

    return (
        <div className="blackjack-container">
            <h1>Blackjack</h1>
            <p>Balance: {balance} €</p>
            <p>{message}</p>

            {!gameInProgress && (
                <div className="betting-section">
                    <input
                        type="number"
                        placeholder="Monto de apuesta"
                        value={betAmount}
                        onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                    />
                    <button onClick={handleBet}>Apostar</button>
                </div>
            )}

            {gameInProgress && (
                <div className="game-section">
                    <div className="hand">
                        <h2>Jugador</h2>
                        <p>Mano: {playerHand.join(", ")}</p>
                        <p>Puntaje: {playerScore}</p>
                    </div>

                    <div className="hand">
                        <h2>Dealer</h2>
                        <p>Mano: {dealerHand.join(", ")}</p>
                        <p>Puntaje: {dealerScore}</p>
                    </div>

                    <button onClick={handleHit} disabled={playerScore > 21}>Pedir Carta</button>
                    <button onClick={handleStand}>Plantarse</button>
                    <button onClick={handleDoubleDown}>Duplicar Apuesta</button>
                </div>
            )}
        </div>
    );
};

export default Blackjack;
