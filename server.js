const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const multer = require("multer");

const app = express();
const server = http.createServer(app);

// 🔥 SOCKET SETUP (Render fix)
const io = socketio(server, {
  cors: {
    origin: "*"
  }
});

// 📁 STATIC
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// 👥 USERS STORE
let users = {}; // { username: socketId }

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

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 👤 JOIN
  socket.on("join", (username) => {
    users[username] = socket.id;
    socket.username = username;

    console.log(username + " joined");

    // 🔥 send users list to everyone
    io.emit("users_list", Object.keys(users));

    // 🔔 notify others
    socket.broadcast.emit("user_joined", username);
  });

  // 💬 PRIVATE MESSAGE
  socket.on("private_message", ({ to, message, from }) => {
    if (users[to]) {
      io.to(users[to]).emit("private_message", {
        from,
        message
      });
    }
  });

  // ✍️ TYPING
  socket.on("typing", (to) => {
    if (users[to]) {
      io.to(users[to]).emit("typing", socket.username);
    }
  });

  // 👥 GROUP CHAT
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(socket.username + " joined room " + room);
  });

  socket.on("group_message", ({ room, message, from }) => {
    io.to(room).emit("group_message", {
      from,
      message
    });
  });

  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    if (socket.username) {
      delete users[socket.username];

      // 🔥 update users list
      io.emit("users_list", Object.keys(users));

      // 🔔 notify others
      io.emit("user_left", socket.username);
    }
  });
});

// 🔥 PORT FIX
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});