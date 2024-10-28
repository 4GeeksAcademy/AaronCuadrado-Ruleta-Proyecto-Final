const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isAuthenticated: false,  // Estado de autenticación del usuario
            userBalance: 0,  // Saldo del usuario
            message: null
        },
        actions: {
            // Acción para iniciar sesión y actualizar autenticación y saldo
            login: (balance) => {
                setStore({ isAuthenticated: true, userBalance: balance });
            },

            // Acción para cerrar sesión
            logout: () => {
                setStore({ isAuthenticated: false, userBalance: 0 });
            },

            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            }
        }
    };
};

export default getState;
