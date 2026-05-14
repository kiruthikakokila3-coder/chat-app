const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const Message = require("./models/Message");

app.use(express.static("public"));

// 🔥 MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/chatDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

let users = {};

io.on("connection", (socket) => {

  socket.on("join", async ({ username, room }) => {
    socket.join(room);
    users[socket.id] = username;

    // load old messages
    const oldMsgs = await Message.find({ room });
    socket.emit("oldMessages", oldMsgs);

    io.to(room).emit("message", {
      user: "System",
      text: username + " joined",
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", users[socket.id]);
  });

  socket.on("sendMessage", async ({ message, room }) => {

    const msgData = {
      user: users[socket.id],
      text: message,
      room,
      time: new Date().toLocaleTimeString()
    };

    // save DB
    await Message.create(msgData);

    io.to(room).emit("message", msgData);
  });

  socket.on("seen", (room) => {
    socket.to(room).emit("seen", users[socket.id]);
  });

});

http.listen(3000, () => {
  console.log("🔥 Server running http://localhost:3000");
});