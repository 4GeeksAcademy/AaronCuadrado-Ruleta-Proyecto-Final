import React, { useState, useEffect } from "react";
import { Navbar } from "../component/Navbar";
import logo1 from "../../img/logo1.png";

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]); // Estado para todas las transacciones
    const [category, setCategory] = useState(""); // Estado para categoría seleccionada
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [sortOrder, setSortOrder] = useState("desc"); // Estado para el orden de las transacciones
    const transactionsPerPage = 5; // Transacciones por página

    // Obtener transacciones del backend
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/transaction-history", {
                    method: "GET",
                    credentials: "include", // Incluir cookies de sesión
                });
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data); // Guardar las transacciones en el estado
                } else {
                    console.error("Error al obtener las transacciones");
                }
            } catch (error) {
                console.error("Error en la solicitud de transacciones:", error);
            }
        };

        fetchTransactions();
    }, []);

    // Cambiar categoría de filtro
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Volver a la primera página al cambiar la categoría
    };

    // Cambiar orden de las transacciones
    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    };

    // Filtrar y ordenar transacciones según la categoría y el orden seleccionado
    const filteredTransactions = transactions
        .filter((transaction) => {
            return category === "" || transaction.transaction_type.toLowerCase() === category.toLowerCase();
        })
        .sort((a, b) => {
            return sortOrder === "desc"
                ? new Date(b.timestamp) - new Date(a.timestamp)
                : new Date(a.timestamp) - new Date(b.timestamp);
        });

    // Paginación de las transacciones
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    // Cambiar página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    return (
        <div className="transactions-page">
            <Navbar />
            <div className="transactions-content">
                <div className="transactions-inner-container">
                    <div className="transactions-logo">
                        <img src={logo1} alt="logo" />
                    </div>
                    <div className="transactions-categories">
                        <select value={category} onChange={handleCategoryChange}>
                            <option value="">Todas las categorías</option>
                            <option value="Recarga de saldo">Ingresos</option>
                            <option value="Retirada">Retiradas</option>
                            <option value="Apuesta">Apuestas</option>
                        </select>
                        <button className="sort-button" onClick={handleSortOrderChange}>
                            Ordenar por: {sortOrder === "desc" ? "Más reciente primero" : "Más antiguo primero"}
                        </button>
                    </div>
                    <div className="transactions-list">
                        {currentTransactions.length > 0 ? (
                            currentTransactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-item">
                                    <p><strong>Tipo:</strong> {transaction.transaction_type}</p>
                                    <p><strong>Valor:</strong> {transaction.amount} €</p>
                                    <p><strong>Fecha:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                                    {transaction.result && <p><strong>Completada:</strong> {transaction.result}</p>}
                                </div>
                            ))
                        ) : (
                            <p>No hay transacciones disponibles para la categoría seleccionada.</p>
                        )}
                    </div>
                    {/* Paginador */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
