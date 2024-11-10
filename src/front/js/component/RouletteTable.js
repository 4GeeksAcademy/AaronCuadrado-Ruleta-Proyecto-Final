// /components/rouletteTable.js
import React from 'react';
import '../../styles/roulette/RouletteTable.css';

const numbers = [
  { number: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    number: i + 1,
    color: (i + 1) % 2 === 0 ? 'black' : 'red',
  })),
];

const RouletteTable = () => {
  return (
    <div className="roulette-table">
      <div className="table-grid">
        {numbers.map((item) => (
          <div key={item.number} className={`table-cell ${item.color}`}>
            {item.number}
          </div>
        ))}
      </div>
      <div className="table-options">
        <button className="bet-option red">Rojo</button>
        <button className="bet-option black">Negro</button>
        <button className="bet-option even">Pares</button>
        <button className="bet-option odd">Impares</button>
      </div>
    </div>
  );
};

export default RouletteTable;
