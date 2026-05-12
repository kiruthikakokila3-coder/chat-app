const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const multer = require("multer");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let users = {};
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: `/uploads/${req.file.filename}` });
});

io.on("connection", (socket) => {
  socket.on("login", ({ username }) => {
    users[socket.id] = username;
    io.emit("userStatus", { user: username, status: "online" });
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    io.to(room).emit("notification", `${users[socket.id]} joined ${room}`);
  });

  socket.on("chatMessage", ({ room, msg }) => {
    io.to(room).emit("message", {
      user: users[socket.id],
      text: msg,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    io.emit("userStatus", { user: users[socket.id], status: "offline" });
    delete users[socket.id];
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
