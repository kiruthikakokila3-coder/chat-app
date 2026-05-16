require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./public/config/db");
const authRoutes = require("./public/routes/authRoutes");
const roomRoutes = require("./public/routes/roomRoutes");
const socketHandler = require("./public/socket/socket");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});