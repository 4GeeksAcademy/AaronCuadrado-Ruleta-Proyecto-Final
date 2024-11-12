const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isAuthenticated: false,
            userBalance: 0,
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

            // Acción para actualizar el balance desde el backend
            updateBalance: async () => {
                console.log("Consultando el balance actualizado desde el backend");
                try {
                    const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/session-info", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.user && typeof data.user.balance !== 'undefined') {
                            console.log("Balance actualizado:", data.user.balance);
                            setStore({ userBalance: data.user.balance, isAuthenticated: true });
                        } else {
                            console.log("Estructura de respuesta inesperada:", data);
                        }
                    } else {
                        console.log("No se pudo obtener el balance del backend");
                    }
                } catch (error) {
                    console.error("Error al consultar el balance:", error);
                }
            }
        }
    };
};

export default getState;
