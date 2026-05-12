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

/* =========================
   📁 UPLOAD FIX (IMPORTANT)
========================= */
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

// API for image upload
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ file: "/uploads/" + req.file.filename });
});

/* =========================
   📊 DATA STORAGE (TEMP)
========================= */
let usersOnline = {};   // { username: socketId }
let messages = {};      // { room: [messages] }
let requests = {};      // { username: [requests] }
let rooms = {};         // { room: {users, password, type} }

/* =========================
   🔌 SOCKET.IO
========================= */
io.on("connection", (socket) => {

  /* 🟢 LOGIN (ONLINE USERS) */
  socket.on("login", (username) => {
    usersOnline[username] = socket.id;
    io.emit("onlineUsers", Object.keys(usersOnline));
  });

  /* 📩 SEND REQUEST */
  socket.on("sendRequest", ({ from, to }) => {
    if (!requests[to]) requests[to] = [];

    // avoid duplicate
    if (!requests[to].includes(from)) {
      requests[to].push(from);
    }

    if (usersOnline[to]) {
      io.to(usersOnline[to]).emit("newRequest", from);
    }
  });

  /* ✅ ACCEPT REQUEST */
  socket.on("acceptRequest", ({ from, to }) => {
    const room = `${from}-${to}`;

    socket.join(room);

    if (!messages[room]) messages[room] = [];

    if (usersOnline[from]) {
      io.to(usersOnline[from]).emit("requestAccepted", { room });
    }
  });

  /* 🚪 JOIN ROOM */
  socket.on("joinRoom", ({ username, room, password, type }) => {

    // create room if not exists
    if (!rooms[room]) {
      rooms[room] = {
        users: [],
        password,
        type
      };
    }

    // 🔐 password check
    if (rooms[room].password !== password) {
      socket.emit("errorMsg", "❌ Wrong password");
      return;
    }

    // 🔒 private limit (max 2)
    if (type === "private" && rooms[room].users.length >= 2) {
      socket.emit("errorMsg", "❌ Private room full (2 max)");
      return;
    }

    // add user if not exists
    if (!rooms[room].users.includes(username)) {
      rooms[room].users.push(username);
    }

    socket.join(room);

    // create message storage
    if (!messages[room]) messages[room] = [];

    // send old messages
    socket.emit("oldMessages", messages[room]);

    // join message
    io.to(room).emit("message", {
      user: "System",
      text: `${username} joined`,
      seen: true
    });
  });

  /* 💬 TEXT MESSAGE */
  socket.on("sendMessage", ({ room, user, text }) => {
    const msg = {
      user,
      text,
      seen: false,
      time: new Date().toLocaleTimeString()
    };

    if (!messages[room]) messages[room] = [];
    messages[room].push(msg);

    io.to(room).emit("message", msg);
  });

  /* 📷 IMAGE */
  socket.on("sendImage", ({ room, user, img }) => {
    io.to(room).emit("image", {
      user,
      img,
      time: new Date().toLocaleTimeString()
    });
  });

  /* 🎤 VOICE */
  socket.on("sendVoice", ({ room, user, audio }) => {
    io.to(room).emit("voice", {
      user,
      audio,
      time: new Date().toLocaleTimeString()
    });
  });

  /* 👀 MARK AS SEEN */
  socket.on("markSeen", (room) => {
    if (messages[room]) {
      messages[room].forEach(m => m.seen = true);
    }
  });

  /* ❌ DISCONNECT */
  socket.on("disconnect", () => {
    for (let user in usersOnline) {
      if (usersOnline[user] === socket.id) {
        delete usersOnline[user];
      }
    }

    io.emit("onlineUsers", Object.keys(usersOnline));
  });

});

/* =========================
   🚀 START SERVER
========================= */
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});