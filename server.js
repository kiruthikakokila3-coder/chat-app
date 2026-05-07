const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("join", (user) => {

    users.push(user);

    io.emit("users", users);
  });

  socket.on("message", (data) => {

    io.emit("message", data);
  });

  socket.on("disconnect", () => {

    console.log("User disconnected");
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running");
});