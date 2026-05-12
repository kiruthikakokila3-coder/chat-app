const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("public"));

let users = {}; // socket.id -> user
let onlineUsers = {}; // username -> socket.id

io.on("connection", (socket) => {

  socket.on("join", ({ username, dp }) => {
    users[socket.id] = { username, dp };
    onlineUsers[username] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  socket.on("message", (data) => {
    const toSocket = onlineUsers[data.to];

    // send to receiver
    if (toSocket) {
      io.to(toSocket).emit("message", data);

      // seen tick
      io.to(socket.id).emit("seen", data.to);
    }

    // send to self
    socket.emit("message", data);
  });

  socket.on("typing", (to) => {
    const toSocket = onlineUsers[to];
    if (toSocket) {
      io.to(toSocket).emit("typing", users[socket.id].username);
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      delete onlineUsers[user.username];
      io.emit("onlineUsers", Object.keys(onlineUsers));
    }
  });

});

server.listen(3000, () => console.log("🔥 Server running"));