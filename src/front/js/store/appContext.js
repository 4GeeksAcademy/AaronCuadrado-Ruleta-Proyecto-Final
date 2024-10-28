import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Inicializamos el contexto global en null.
export const Context = React.createContext(null);

// Función para inyectar el contexto global en cualquier componente. Se usa en `Layout.js`.
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// Estado para almacenar `store` y `actions`, definidos en `flux.js`
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
			// Este código se ejecuta solo una vez en la vida de la aplicación (similar a window.onload)
			// Aquí puedes realizar solicitudes API iniciales si es necesario
			state.actions.getMessage(); // Ejemplo de llamada a una acción en `flux.js`
		}, []);

		// Se proporciona `state` como valor del contexto, incluyendo `store`, `actions` y `setStore`
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
