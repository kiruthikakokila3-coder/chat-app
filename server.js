const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Dummy login users
const users = {
  user1: "123",
  user2: "123"
};

// LOGIN API
app.get("/login", (req, res) => {
  const { username, password } = req.query;

  if (users[username] && users[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

io.on("connection", (socket) => {

  // PUBLIC CHAT
  socket.on("public message", (msg) => {
    io.emit("public message", msg);
  });

  // JOIN PRIVATE ROOM
  socket.on("join private", (room) => {
    socket.join(room);
  });

  // PRIVATE CHAT
  socket.on("private message", ({ room, msg }) => {
    socket.to(room).emit("private message", msg);
  });

});

server.listen(3000, () => {
  console.log("Server running on 3000");
});