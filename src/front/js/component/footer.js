import React from "react";
import "../../styles/footer.css"; // Asegúrate de que la ruta a tu archivo CSS es correcta

export const Footer = () => (
	<footer>
		<div className="footer-container">
			<div className="footer-column">
				<h4>Contacto</h4>
				<p>email@ruletadorada.com</p>
				<p>Tel: +34 112 112 112</p><br></br>
			</div>

			<div className="footer-column">
				<h4>Redes Sociales</h4>
				<div className="social-icons">
					<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
					<a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
					<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
				</div><br></br>
			</div>

			<div className="footer-column">
				<h4>Dirección</h4>
				<p>Calle no se me ocurre, Barakaldo, Bizkaia</p>
			</div><br></br>
		</div>
		<div className="copyright">
			&copy; 2024 Hecho por Aaron Cuadrado. Todos los derechos reservados.
		</div>
	</footer>
);

