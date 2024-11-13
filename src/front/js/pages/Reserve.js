import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/reserve.css"; 

export const Reserve = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vehicle } = location.state || {};
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");

    if (!vehicle) {
        return <p>Vehículo no encontrado. Por favor, selecciona un vehículo primero.</p>;
    }

    const calculateTotalPrice = () => {
        if (!startDate || !endDate) {
            setError("Por favor, selecciona ambas fechas.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            setError("La fecha de inicio debe ser anterior a la fecha de fin.");
            return;
        }

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setTotalPrice(days * vehicle.monthly_price / 30); // Aproximación diaria
        setError("");
    };

    const handleConfirm = async () => {
        if (!startDate || !endDate || totalPrice === 0) {
            setError("Completa todos los campos antes de confirmar.");
            return;
        }

        try {
            const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    vehicle_id: vehicle.id,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate("/payment", { state: { booking: data.booking } });
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al confirmar la reserva.");
            }
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="reserve-container">
            <h1>Reservar Vehículo</h1>
            <div className="vehicle-details">
                <img
                    src={vehicle.image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vehicle-image"
                />
                <div className="vehicle-info">
                    <h2>{`${vehicle.brand} ${vehicle.model}`}</h2>
                    <p>Color: {vehicle.color}</p>
                    <p>Año: {vehicle.year}</p>
                    <p>Precio diario: {(vehicle.monthly_price / 30).toFixed(2)}€</p>
                </div>
            </div>

            <form className="reservation-form">
                <div className="form-group">
                    <label>Fecha de Inicio:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Fecha de Fin:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="calculate-button"
                    onClick={calculateTotalPrice}
                >
                    Calcular Precio
                </button>

                {totalPrice > 0 && (
                    <p className="total-price">
                        Precio Total: {totalPrice.toFixed(2)}€
                    </p>
                )}

                {error && <p className="error-message">{error}</p>}

                <button
                    type="button"
                    className="confirm-button"
                    onClick={handleConfirm}
                >
                    Confirmar Reserva
                </button>
            </form>
        </div>
    );
};
