import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/menu.css";
import { Navbar } from "../component/Navbar";

export const Menu = () => {
    const navigate = useNavigate();

    const handlePlayButtonClick = () => {
        navigate("/roulette");
    };

    return (
        <div className="menu-container">
            <Navbar />
            <div className="button-container">
                <button className="play-button" onClick={handlePlayButtonClick}>
                    JUGAR
                </button>
            </div>
        </div>
    );
};
