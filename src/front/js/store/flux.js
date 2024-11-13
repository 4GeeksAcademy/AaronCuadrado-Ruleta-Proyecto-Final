const getState = ({ getStore, setStore }) => {
    return {
        store: {
            isAuthenticated: false,
            user: null,
        },
        actions: {
            login: (user) => {
                setStore({ isAuthenticated: true, user });
                console.log("Inicio de sesión exitoso", user);
            },

            logout: () => {
                setStore({ isAuthenticated: false, user: null });
                console.log("Cierre de sesión exitoso");
            },

            syncAuth: async () => {
                try {
                    const response = await fetch("https://ideal-guacamole-v6pq4wxxw5w4hrxj-3001.app.github.dev/api/session-info", {
                        method: "GET",
                        credentials: "include", // Asegura que las cookies de sesión se envíen
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ isAuthenticated: true, user: data.user });
                        console.log("Sesión sincronizada", data.user);
                    } else {
                        setStore({ isAuthenticated: false, user: null });
                        console.log("No hay sesión activa");
                    }
                } catch (error) {
                    console.error("Error al sincronizar sesión:", error);
                    setStore({ isAuthenticated: false, user: null });
                }
            }
            
        },
    };
};

export default getState;
