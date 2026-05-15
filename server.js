const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const multer = require("multer");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

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

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    users[socket.id] = name;
    io.emit("online", Object.values(users));
  });

  socket.on("msg", (msg) => {
    io.emit("msg", { user: users[socket.id], text: msg });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", users[socket.id] + " typing...");
  });

  socket.on("file", (file) => {
    io.emit("file", { user: users[socket.id], file });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("online", Object.values(users));
  });

});

http.listen(3000, () => console.log("🔥 running"));