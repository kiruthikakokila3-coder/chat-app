module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};