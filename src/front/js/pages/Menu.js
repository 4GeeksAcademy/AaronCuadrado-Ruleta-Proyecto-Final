import React from "react";
import "../../styles/menu.css";
import { Navbar } from "../component/Navbar";

export const Menu = () => {
    return (
        <div className="menu-container">
            <Navbar />
            <div className="button-container">
                <button className="play-button">JUGAR</button>
            </div>
        </div>
    );
};