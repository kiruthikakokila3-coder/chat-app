const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/groups", require("./routes/groups"));

// SOCKET
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", (room) => {
        socket.join(room);
    });

    socket.on("chatMessage", (data) => {
        io.to(data.room).emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on " + PORT);
});