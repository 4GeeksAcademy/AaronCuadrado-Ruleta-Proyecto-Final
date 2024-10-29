import React from "react";
import PropTypes from "prop-types";

//asegurar de que la pagina siempre comience desde el inicio al cambiar de ruta
class ScrollToTop extends React.Component {
	
	//Este metodo se ejecuta cada vez que el componente se actualiza
	componentDidUpdate(prevProps) {
		//Compara la ubicacion actual con la ubicacion anterior
		//Si han cambiado, significa que se ha navegado a una nueva ruta
		if (this.props.location !== prevProps.location) {
			//Desplaza la ventana hasta la parte superior a la izquierda
			window.scrollTo(0, 0);
		}
	}

	//Renderiza los hijos del componente, permitiendo que actue como un contenedor sin modificar el contenido
	render() {
		return this.props.children;
	}
}

export default ScrollToTop;

//Define las propiedades que el componente espera recibir
ScrollToTop.propTypes = {
	location: PropTypes.object, //Ubicacion actual de la ruta
	children: PropTypes.any //Cualquier contenido hijo que se renderizara dentro de ese componente
};
