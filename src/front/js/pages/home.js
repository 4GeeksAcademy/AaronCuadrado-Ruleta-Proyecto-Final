import React from "react";
import "../../styles/home/home.css";
import giulia from "../../img/giulia.jpeg";
import mustang from "../../img/mustang.jpg";
import panamera from "../../img/panamera.jpg";


export const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-text">
                    <h1>Conduce con libertad</h1>
                    <p>Encuentra el coche perfecto con Veloce Renting. ¡Sin preocupaciones, solo disfruta!</p>
                    <a href="/vehicles" className="btn-explore">Explorar Vehiculos</a>
                </div>
            </div>

            {/* Seccion de informacion */}
            <div className="info-section">
                <h2>¿Como funciona?</h2>
                <div className="info-cards">
                    <div className="info-card">
                        <h3>Variedad de modelos</h3>
                        <p>Disponemos de coches para todos los gustos y necesidades.</p>
                    </div>
                    <div className="info-card">
                        <h3>Pagos seguros</h3>
                        <p>Renta facilmente y de manera segura con nuestro sistema de pagos</p>
                    </div>
                    <div className="info-card">
                        <h3>Mantenimiento incluido</h3>
                        <p>Olvidate de los problemas. Nosotros nos encargamos de todo</p>
                    </div>
                </div>
            </div>

            {/* Galeria de vehiculos */}
            <div className="gallery-section">
                <h2>Vehiculos Destacados</h2>
                <div className="vehicle-cards">
                    <div className="vehicle-card">
                        <img src={giulia} alt="giulia" />
                        <h3>Alfa Romeo Giulia</h3>
                        <p>Desde 15€/dia</p>
                    </div>
                    <div className="vehicle-card">
                        <img src={mustang} alt="mustang" />
                        <h3>Ford Mustang</h3>
                        <p>Desde 20€/dia</p>
                    </div>
                    <div className="vehicle-card">
                        <img src={panamera} alt="panamera" />
                        <h3>Porsche Panamera</h3>
                        <p>Desde 40€/dia</p>
                    </div>
                </div>
            </div>
        </div>
    );
};