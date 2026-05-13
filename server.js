const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// 🔥 ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/ai", require("./routes/ai"));

// 🔥 SOCKET
require("./sockets/socket")(io);

// 🔥 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🚀 START
server.listen(3000, () =>
  console.log("🔥 Server running http://localhost:3000")
);