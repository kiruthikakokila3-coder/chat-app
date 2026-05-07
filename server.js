const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ✅ FIX 1: CORS add
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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

// ✅ FIX 2: Render PORT use
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});