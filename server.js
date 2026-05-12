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
let messages = {}; // store messages per room

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: `/uploads/${req.file.filename}` });
});

io.on("connection", (socket) => {
  socket.on("login", ({ username, dp }) => {
    if (!username) username = "Guest-" + socket.id.slice(0,4);
    users[socket.id] = { username, dp, status: "online" };
    io.emit("userStatus", { user: username, status: "online" });
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    if (!messages[room]) messages[room] = [];
    io.to(room).emit("notification", `${users[socket.id].username} joined ${room}`);
  });

  socket.on("chatMessage", ({ room, msg }) => {
    const message = {
      id: Date.now(),
      user: users[socket.id].username,
      dp: users[socket.id].dp,
      text: msg,
      time: new Date().toLocaleTimeString(),
      seenBy: []
    };
    messages[room].push(message);
    io.to(room).emit("message", message);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", users[socket.id].username);
  });

  socket.on("seenMessage", ({ room, msgId }) => {
    const msg = messages[room].find(m => m.id === msgId);
    if (msg && !msg.seenBy.includes(users[socket.id].username)) {
      msg.seenBy.push(users[socket.id].username);
      io.to(room).emit("updateSeen", msg);
    }
  });

  socket.on("deleteMessage", ({ room, msgId }) => {
    messages[room] = messages[room].filter(m => m.id !== msgId);
    io.to(room).emit("deleteMessage", msgId);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("userStatus", { user: users[socket.id].username, status: "offline" });
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
