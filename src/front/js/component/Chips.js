// /components/chips.js
import React, { useState } from 'react';
import '../../styles/roulette/Chips.css';

const chipValues = [0.2, 0.5, 1, 2, 5, 10, 25, 50, 100];

const Chips = () => {
  const [selectedChip, setSelectedChip] = useState(null);

  const handleChipSelect = (value) => {
    setSelectedChip(value);
  };

  return (
    <div className="chips-container">
      {chipValues.map((value) => (
        <div
          key={value}
          className={`chip ${selectedChip === value ? 'selected' : ''}`}
          onClick={() => handleChipSelect(value)}
        >
          €{value}
        </div>
      ))}
    </div>
  );
};

export default Chips;
