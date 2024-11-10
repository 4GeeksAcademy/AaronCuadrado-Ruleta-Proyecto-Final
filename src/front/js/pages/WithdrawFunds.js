import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/navbar-options/withdraw.css";
import { Navbar } from "../component/Navbar";

//Componente de retirada de fondos
export const WithdrawFunds = () => {
    const { store, actions } = useContext(Context);//Obtener estado global y las acciones
    const [amount, setAmount] = useState("");//Estado para almacenar la cantidad que el usuario quiere retirar
    const [message, setMessage] = useState("");//Estado para mostrar mensajes al usuario

    //Funcion que se ejecuta al hacer clic en el boton de retirada
    const handleWithdraw = async () => {
        //Validacion para verificar que la cantidad sea positiva y no supere el balance del usuario
        if (amount <=0 || amount > store.userBalance) {
            setMessage("Cantidad no valida o saldo insuficiente");
            return;
        }

        try{
            //solicitud al backend para la retirada
            const response = await fetch("https://cuddly-space-capybara-4jqw46xx6v46fvv7-3001.app.github.dev/api/withdraw-funds", 
                {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ amount })
             });

            //si la respuesta es exitosa
            if (response.ok) {
                const data = await response.json(); //convierte la respuesta en JSON
                setMessage(data.message); //Muestra el mensaje de exito
                actions.updateBalance(data.new_balance);//Actualiza el balance
                setAmount("");//Limpia el campo de cantidad
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || "Error en la retirada");
            }
        } catch (error) {
            setMessage("Hubo un error al procesar la solicitud");
        }
    };

    return(
        <div>
            <Navbar/>
        <div className="withdraw-container">
            <h2>Retirar Fondos</h2>
            <p>Saldo disponible: {store.userBalance} €</p>

            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Cantidad a retirar"/>

            <button onClick={handleWithdraw}>Confirmar retirada</button>
            {message && <p className="message">{message}</p>}
        </div>
        </div>
    );
};
