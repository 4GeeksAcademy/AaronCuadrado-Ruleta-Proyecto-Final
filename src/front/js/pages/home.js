import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../../img/logo1.png";
import "../../styles/home.css";

export const Home = () => {
	return (
	  <div className="home-container">
		<div className="overlay">
		  <img src={logo1} alt="Casino Logo" className="logo" />
		  <h1>¡Bienvenido a la ruleta!</h1>
		  <div className="buttons-container">
			<Link to="/register" className="btn register-btn">
			  Registrarse
			</Link>
			<Link to="/login" className="btn login-btn">
			  Iniciar Sesion
			</Link>
		  </div>
		</div>
	  </div>
	);
  };
  
 