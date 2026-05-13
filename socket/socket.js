module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.room).emit("newMessage", data);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};