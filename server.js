const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

/* 📷 Upload */
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: "/uploads/" + req.file.filename });
});

/* 👥 Users */
let users = {};

io.on("connection", (socket) => {

  socket.on("login", (user) => {
    users[socket.id] = user;
    io.emit("online", Object.values(users));
  });

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("msg", (data) => {
    io.to(data.room).emit("msg", data);
  });

  socket.on("typing", (user) => {
    socket.broadcast.emit("typing", user);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online", Object.values(users));
  });

});

server.listen(3000);