const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chat");

// Schema
const Msg = mongoose.model("Msg", {
  user: String,
  text: String
});

// static
app.use(express.static("public"));

// users
let users = [];

io.on("connection", (socket) => {

  socket.on("join", (user) => {
    users.push(user);
    io.emit("online", users.length);
  });

  socket.on("msg", async (data) => {
    await Msg.create(data);
    io.emit("msg", data);
  });

  socket.on("typing", (name)=>{
    socket.broadcast.emit("typing", name + " typing...");
  });

  socket.on("disconnect", ()=>{
    users.pop();
    io.emit("online", users.length);
  });

});

server.listen(3000, ()=>console.log("Server running"));