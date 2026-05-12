const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // socket.id -> username
let onlineUsers = {}; // username -> socket.id

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    onlineUsers[username] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  socket.on("privateMessage", ({ to, message, from }) => {
    const target = onlineUsers[to];

    if (target) {
      io.to(target).emit("privateMessage", { message, from });
    }
  });

  socket.on("typing", ({ to, from }) => {
    const target = onlineUsers[to];

    if (target) {
      io.to(target).emit("typing", from);
    }
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];

    delete users[socket.id];
    delete onlineUsers[username];

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

server.listen(3000, () => console.log("Server running"));