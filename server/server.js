const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Serve static files (public folder)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ FIX: root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ✅ Users storage
let users = {};

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("message", `${username} joined the chat`);
  });

  // Message
  socket.on("chatMessage", (msg) => {
    const username = users[socket.id];
    io.emit("message", `${username}: ${msg}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("message", `${username} left the chat`);
      delete users[socket.id];
    }
  });
});

// ✅ Render PORT fix
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});