const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});
require("./socket/socket")(io);

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/upload", require("./routes/upload"));

// PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on " + PORT);
});