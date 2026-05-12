const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// ✅ public folder serve
app.use(express.static("public"));

// ✅ default route → index.html open ஆகும்
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 👥 users store
let users = {};

io.on("connection", (socket) => {

  // 🔥 join room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    users[socket.id] = { username, room };

    socket.to(room).emit("message", {
      user: "System",
      text: `${username} joined 👋`
    });

    updateUsers(room);
  });

  // 💬 message
  socket.on("message", (data) => {
    io.to(data.room).emit("message", data);
  });

  // 📸 image
  socket.on("image", (data) => {
    io.to(data.room).emit("image", data);
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      socket.to(user.room).emit("message", {
        user: "System",
        text: `${user.username} left ❌`
      });

      delete users[socket.id];
      updateUsers(user.room);
    }
  });

  // 🟢 update users list
  function updateUsers(room) {
    const roomUsers = Object.values(users)
      .filter(u => u.room === room)
      .map(u => u.username);

    io.to(room).emit("userList", roomUsers);
  }

});

// 🚀 start server
http.listen(3001, () => {
  console.log("🔥 Server running on port 3001");
});