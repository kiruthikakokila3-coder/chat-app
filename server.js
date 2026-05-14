const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*"
  }
});

app.use(express.static("public"));

// default page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// socket connection
let users = [];

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    users.push(name);
    io.emit("online", users.length);
  });

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    users.pop();
    io.emit("online", users.length);
  });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running on " + PORT);
});