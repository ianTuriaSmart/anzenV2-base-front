// cliente.js
const io = require("socket.io-client");

// Conectamos al servidor WebSocket en localhost:3000
const socket = io("ws://localhost:3000");

// Cuando el cliente se conecta
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket. ID del socket:", socket.id);
});

// Escuchar el mensaje que envía el servidor
socket.on("message", (message) => {
  console.log("Mensaje recibido del servidor:", message);
});

socket.on("newReservation", (data) => {
  console.log("Nueva reserva:", data);
});

// Detectar cuando el cliente se desconecta
socket.on("disconnect", () => {
  console.log("Desconectado del servidor WebSocket");
});
