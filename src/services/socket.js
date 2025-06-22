import { io } from "socket.io-client";


const SOCKET_URL = process.env.SOCKET_URL;

// Configuración de la conexión con try-catch para capturar errores
let socket;

const socketManager = {

  connect: () => {
    try {
      // Solo crear la conexión si no existe o si ya no está conectada
      if (!socket || !socket.connected) {
        socket = io(SOCKET_URL, {
          autoConnect: true, // Conectarse automáticamente al cargar
          reconnection: true, // Reconectar si se pierde la conexión
          reconnectionDelay: 1000,
          reconnectionAttempts: 10,
          transports: ["websocket"], // Usar el transporte WebSocket
        });

        socket.on("connect", () => {
          //console.log("Conectado al servidor de websockets");
        });

        socket.on("disconnect", () => {
          //console.log("Desconectado del servidor de websockets");
        });

        socket.on("connect_error", (err) => {
          //console.error("Error de conexión WebSocket:", err.message || err);
        });
      }
    } catch (error) {
      //console.error("Error al intentar conectar al WebSocket:", error);
    }
  },

  disconnect: () => {
    if (socket && socket.connected) {
      socket.disconnect();
      socket = null; // Limpiar la referencia después de desconectar
    }
  },

  // Si necesitas acceder al socket directamente:
  getSocket: () => socket,
};

export { socketManager };
