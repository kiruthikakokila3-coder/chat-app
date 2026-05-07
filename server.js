const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // socket.id -> username

// File upload setup
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ file: req.file.filename });
});

// Socket
io.on("connection", (socket) => {

    socket.on("login", (username) => {
        users[socket.id] = username;
        io.emit("users", Object.values(users));
    });

    socket.on("private message", ({ to, message }) => {
        for (let id in users) {
            if (users[id] === to) {
                io.to(id).emit("private message", {
                    from: users[socket.id],
                    message
                });
            }
        }
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users", Object.values(users));
    });
});

server.listen(3000, () => {
    console.log("Server running http://localhost:3000");
});