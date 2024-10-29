import React, { useState } from "react";
import { Navbar } from "../component/Navbar";
import { Footer } from "../component/footer";
import "../../styles/transactions.css";
import logo1 from "../../img/logo1.png";

export const Transactions = () => {
    const [category, setCategory] = useState(""); //Estado para la categoria seleccionada

    //Manejar los cambios en el filtro de busqueda
    const handleCategoryChange = (e) => {
        setCategory(e.target.value); //Actualiza el estado con la categoria seleccionada
    };

    return (
        <div className="transactions-page">
            <Navbar />
            <div className="transactions-content">
                <div className="transactions-logo">
                    <img src={logo1} alt="logo" />
                </div>
                <div className="transactions-categories">
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="">Todas las categorias</option>
                        <option value="bet">Apuestas</option>
                        <option value="deposit">Ingresos</option>
                        <option value="withdraw">Retiradas</option>
                    </select>
                </div>
            </div>

            <div className="transactions-list">

            </div>
            <Footer />
        </div>
    );
};