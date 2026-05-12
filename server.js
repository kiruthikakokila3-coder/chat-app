const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // socket.id -> username
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    onlineUsers[username] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // PRIVATE MESSAGE
  socket.on("privateMessage", ({ to, message, from }) => {
    const targetSocket = onlineUsers[to];

    if (targetSocket) {
      io.to(targetSocket).emit("privateMessage", {
        message,
        from,
      });
    }
  });

  // TYPING
  socket.on("typing", ({ to, from }) => {
    const targetSocket = onlineUsers[to];
    if (targetSocket) {
      io.to(targetSocket).emit("typing", from);
    }
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete onlineUsers[username];
    delete users[socket.id];

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});