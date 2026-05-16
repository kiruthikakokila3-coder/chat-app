const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ✅ FIXED PUBLIC PATH
app.use(express.static(path.join(__dirname, "../public")));

// ✅ HOME ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 💬 SOCKET.IO CHAT
io.on("connection", (socket) => {
  console.log("User connected");

  // Receive message
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 🚀 SERVER START
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});