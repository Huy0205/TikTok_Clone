const { Server } = require("socket.io");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("likeVideo", ({ videoId, userId }) => {
      console.log(`User ${userId} liked video ${videoId}`);
      io.emit("updateLike", { videoId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = socketHandler;
