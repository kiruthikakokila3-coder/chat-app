module.exports = function (io) {

  let onlineUsers = {};

  io.on("connection", (socket) => {

    socket.on("join", (user) => {
      onlineUsers[socket.id] = user;
      io.emit("onlineUsers", Object.values(onlineUsers));
    });

    // PUBLIC
    socket.on("joinPublic", (user) => {
      socket.join("public");
    });

    socket.on("publicMessage", ({ user, msg }) => {
      io.to("public").emit("message", {
        user,
        msg,
        time: new Date().toLocaleTimeString()
      });
    });

    // PRIVATE
    socket.on("joinPrivate", ({ user, friend }) => {
      const room = [user, friend].sort().join("-");
      socket.join(room);
      socket.room = room;
    });

    socket.on("privateMessage", ({ user, friend, msg }) => {
      const room = [user, friend].sort().join("-");
      io.to(room).emit("message", {
        user,
        msg,
        time: new Date().toLocaleTimeString()
      });
    });

    // TYPING
    socket.on("typing", (user) => {
      socket.broadcast.emit("typing", user + " typing...");
    });

    socket.on("disconnect", () => {
      delete onlineUsers[socket.id];
      io.emit("onlineUsers", Object.values(onlineUsers));
    });

  });

};