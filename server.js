const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/auth", require("./routes/auth"));

// socket
require("./socket/socket")(io);

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("🔥 Server running on " + PORT));