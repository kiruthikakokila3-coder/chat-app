const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

let users = {};

// 📎 FILE UPLOAD
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file.filename });
});

// 🔥 SOCKET
io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[username] = socket.id;
    socket.username = username;
  });

  // 💬 PRIVATE
  socket.on("private_message", ({ to, message, from }) => {
    if (users[to]) {
      io.to(users[to]).emit("private_message", { from, message });
    }
  });

  // 👥 GROUP
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("group_message", ({ room, message, from }) => {
    io.to(room).emit("group_message", { from, message });
  });

  // ✍️ TYPING
  socket.on("typing", (to) => {
    if (users[to]) {
      io.to(users[to]).emit("typing", socket.username);
    }
  });

});

server.listen(3001, () => {
  console.log("🔥 Server running on port 3001");
});