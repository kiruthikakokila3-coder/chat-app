const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
let rooms = {}; // roomName -> { password, users[] }

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ username, room, password }) => {

    // create room
    if (!rooms[room]) {
      rooms[room] = { password, users: [] };
    }

    // check password
    if (rooms[room].password && rooms[room].password !== password) {
      socket.emit("wrongPassword");
      return;
    }

    users[socket.id] = { username, room };
    rooms[room].users.push(username);

    socket.join(room);

    io.to(room).emit("roomUsers", rooms[room].users);
  });

  socket.on("message", (data) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", data);
    }
  });

  socket.on("typing", (name) => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit("typing", name);
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    rooms[user.room].users =
      rooms[user.room].users.filter(u => u !== user.username);

    io.to(user.room).emit("roomUsers", rooms[user.room].users);

    delete users[socket.id];
  });
});

server.listen(3000, () => console.log("Server running"));