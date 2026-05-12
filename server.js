const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

/* 📁 Upload setup */
const uploadPath = "public/uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ file: "/uploads/" + req.file.filename });
});

/* 📊 Data */
let users = {};
let rooms = {};
let messages = {};

io.on("connection", (socket) => {

  socket.on("login", (username) => {
    users[username] = socket.id;
    io.emit("onlineUsers", Object.keys(users));
  });

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    if (!rooms[room]) rooms[room] = [];
    if (!rooms[room].includes(username)) rooms[room].push(username);

    io.to(room).emit("status", `${username} joined 🟢`);
  });

  socket.on("sendMessage", ({ room, user, text }) => {
    const msg = {
      user,
      text,
      time: new Date().toLocaleTimeString()
    };

    if (!messages[room]) messages[room] = [];
    messages[room].push(msg);

    io.to(room).emit("message", msg);
  });

  socket.on("typing", ({ room, user }) => {
    socket.to(room).emit("typing", user);
  });

  socket.on("seen", ({ room, user }) => {
    socket.to(room).emit("seen", user);
  });

  socket.on("disconnect", () => {
    for (let u in users) {
      if (users[u] === socket.id) {
        delete users[u];
        io.emit("onlineUsers", Object.keys(users));
      }
    }
  });

});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});