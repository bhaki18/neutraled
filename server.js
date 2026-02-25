const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // permette connessioni da qualsiasi dominio
});

const PORT = process.env.PORT || 3000;

let players = {};

io.on("connection", (socket) => {
    console.log("Nuovo giocatore:", socket.id);
    players[socket.id] = { x: 100, y: 100 };

    // invia lo stato a chi si connette
    socket.emit("currentPlayers", players);

    // notifica agli altri
    socket.broadcast.emit("newPlayer", { id: socket.id, x: 100, y: 100 });

    // ricevi movimenti
    socket.on("playerMovement", (data) => {
        players[socket.id] = data;
        socket.broadcast.emit("playerMoved", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        socket.broadcast.emit("playerDisconnected", socket.id);
    });
});

server.listen(PORT, () => console.log(`Server in ascolto su ${PORT}`));