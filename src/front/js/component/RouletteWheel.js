// /components/rouletteWheel.js
import React, { useEffect, useRef } from 'react';
import '../../styles/roulette/RouletteWheel.css';

const numbers = [
  { number: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    number: i + 1,
    color: (i + 1) % 2 === 0 ? 'black' : 'red',
  })),
];

const RouletteWheel = ({ winningNumber }) => {
  const ballRef = useRef(null);

  useEffect(() => {
    if (winningNumber !== null) {
      // Animación de la bola girando hasta el número ganador
      const rotationDegrees = 360 + (winningNumber * 360) / 37; // Ajustar según el número ganador
      ballRef.current.style.transform = `rotate(${rotationDegrees}deg)`;
    }
  }, [winningNumber]);

  return (
    <div className="roulette-wheel">
      <div className="wheel">
        {numbers.map((item) => (
          <div
            key={item.number}
            className={`number ${item.color}`}
            style={{ transform: `rotate(${(item.number * 360) / 37}deg)` }}
          >
            {item.number}
          </div>
        ))}
        <div className="ball" ref={ballRef} />
      </div>
      {winningNumber !== null && (
        <div className="winning-number">
          ¡Número ganador: {winningNumber}!
        </div>
      )}
    </div>
  );
};

export default RouletteWheel;
