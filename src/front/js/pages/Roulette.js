// /pages/roulette.js
import React, { useState } from 'react';
import RouletteWheel from '../component/RouletteWheel';
import RouletteTable from '../component/RouletteTable';
import Chips from '../component/Chips';
import '../../styles/roulette/roulette.css';

const Roulette = () => {
  const [betTime, setBetTime] = useState(true);
  const [winningNumber, setWinningNumber] = useState(null);

  const handleSpin = () => {
    setBetTime(false);
    setTimeout(() => {
      // Simulamos la obtención del número ganador desde el backend o local
      fetch('https://cuddly-space-capybara-4jqw46xx6v46fvv7-3001.app.github.dev/api/bet')
        .then(response => response.json())
        .then(data => {
          setWinningNumber(data.roulette_number);
          setBetTime(true);
        });
    }, 3000); // Simula el tiempo de giro de la ruleta
  };

  return (
    <div className="roulette-page">
      <h1 className="casino-title">Casino Roulette</h1>
      <RouletteWheel winningNumber={winningNumber} />
      <RouletteTable />
      <div className="controls">
        <button onClick={handleSpin} disabled={!betTime}>Girar la Ruleta</button>
        <button disabled={!betTime}>Duplicar Apuesta</button>
        <button disabled={!betTime}>Borrar Apuesta</button>
      </div>
      <Chips />
    </div>
  );
};

export default Roulette;
