import React from "react";
import { Link } from "react-router-dom";
import titulo from "../../img/titulo.jpg";
import "../../styles/home.css";

export const Home = () => {
	return (
	  <div className="home-container">
		<div className="overlay">
		  <img src={titulo} alt="Casino Logo" className="logo" />
		  <h1>¡Bienvenido al Casino!</h1>
		  <div className="buttons-container">
			<Link to="/register" className="btn register-btn">
			  Registro
			</Link>
			<Link to="/login" className="btn login-btn">
			  Inicio de Sesión
			</Link>
		  </div>
		</div>
	  </div>
	);
  };
  
 