import React from 'react';
import '../../styles/roulette/Chips.css';

const chipValues = [
  { value: 0.2, className: 'chip-0-2' },
  { value: 0.5, className: 'chip-0-5' },
  { value: 1, className: 'chip-1' },
  { value: 2, className: 'chip-2' },
  { value: 5, className: 'chip-5' },
  { value: 10, className: 'chip-10' },
  { value: 25, className: 'chip-25' },
  { value: 50, className: 'chip-50' },
  { value: 100, className: 'chip-100' }
];

const Chips = ({ onSelectAmount }) => {
  return (
    <div className="chips-container">
      {chipValues.map((chip, index) => (
        <button
          key={index}
          className={`chip ${chip.className}`}
          onClick={() => onSelectAmount(chip.value)}
        >
          {chip.value}€
        </button>
      ))}
    </div>
  );
};

export default Chips;
