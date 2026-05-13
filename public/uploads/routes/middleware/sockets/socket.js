module.exports = (io) => {
  const users = {};

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      users[userId] = socket.id;
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", (data) => {
      if (data.roomId) {
        io.to(data.roomId).emit("newMessage", data);
      } else {
        const target = users[data.receiver];
        if (target) io.to(target).emit("newMessage", data);
      }
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data.userId);
    });

  });
};