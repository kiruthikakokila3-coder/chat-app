const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // dynamic users

// LOGIN
app.get("/login", (req, res) => {
  const { username, password } = req.query;

  if (!users[username]) {
    users[username] = password;
    return res.json({ success: true });
  }

  if (users[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

io.on("connection", (socket) => {

  // PUBLIC CHAT
  socket.on("public", (msg) => {
    io.emit("public", msg);
  });

  // JOIN ROOM
  socket.on("join", (room) => {
    socket.join(room);
  });

  // PRIVATE CHAT
  socket.on("private", ({ room, msg }) => {
    socket.to(room).emit("private", msg);
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running on " + PORT));