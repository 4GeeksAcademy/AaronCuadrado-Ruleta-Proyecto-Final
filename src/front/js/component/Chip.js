import React from "react";
import "../../styles/roulette/chip.css";

export const Chip = ({ value, onSelect }) => {
    return (
        <div
            className="chip"
            draggable
            onDragStart={(e) => onSelect(e, value)}
        >
            €{value}
        </div>
    );
};
