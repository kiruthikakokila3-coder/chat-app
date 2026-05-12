const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

// 🔐 PASSWORDS
const passwords = {
  private: "123",
  public: "123"
};

io.on("connection", (socket) => {

  socket.on("join_secure_room", ({ type, password, username }) => {

    if (password !== passwords[type]) {
      socket.emit("access_denied");
      return;
    }

    const room = type + "-room";

    socket.join(room);

    users[socket.id] = { username, room };

    socket.emit("access_granted");

    updateUsers(room);
  });

  socket.on("room_message", ({ room, message, from }) => {
    io.to(room).emit("room_message", { message, from });
  });

  socket.on("typing", ({ user, room }) => {
    socket.to(room).emit("typing", { user });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      delete users[socket.id];
      updateUsers(user.room);
    }
  });

  function updateUsers(room) {
    const online = Object.values(users)
      .filter(u => u.room === room)
      .map(u => u.username);

    io.to(room).emit("online_users", online);
  }

});

server.listen(3000, () => {
  console.log("Server running 🚀 http://localhost:3000");
});