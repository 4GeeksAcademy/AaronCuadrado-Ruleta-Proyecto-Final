import React, { useEffect, useState } from "react";
import "../../styles/vehicles.css"; 
import { useNavigate } from "react-router-dom";

export const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/vehicles", {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Error al cargar los vehículos");
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los vehículos.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleReserveClick = (vehicle) => {
        navigate("/reserve", { state: { vehicle } });
    };

    if (loading) {
        return <p>Cargando vehículos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="vehicles-container">
            <h1>Vehículos Disponibles</h1>
            <div className="vehicles-grid">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="vehicle-card">
                        <img
                            src={vehicle.image_url}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="vehicle-image"
                        />
                        <div className="vehicle-info">
                            <h3>{`${vehicle.brand} ${vehicle.model}`}</h3>
                            <p>Color: {vehicle.color}</p>
                            <p>Año: {vehicle.year}</p>
                            <p>Precio mensual: {vehicle.monthly_price}€</p>
                            <button className="reserve-button" onClick={() => handleReserveClick(vehicle)}
                            >
                                Reservar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
