let io;
const userSocketMap = new Map();

const initSocket = (server) => {
  const { Server } = require("socket.io");
  const { NotificationServices } = require("../app/services");

  io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (tiktokId) => {
      userSocketMap.set(tiktokId, socket.id);
      console.log(`User ${tiktokId} mapped to socket ${socket.id}`);
    });

    socket.on("joinRoom", ({ roomId, roomType }) => {
      const fullRoomId = `${roomType}_${roomId}`;
      socket.join(fullRoomId);
      console.log(`User ${socket.id} joined room ${fullRoomId}`);
    });

    socket.on("leaveRoom", ({ roomId, roomType }) => {
      const fullRoomId = `${roomType}_${roomId}`;
      socket.leave(fullRoomId);
      console.log(`User ${socket.id} left room ${fullRoomId}`);
    });

    socket.on("updateLikeCount", ({ publisherId, videoId, action }) => {
      const change = action === "like" ? 1 : -1;
      emitRoom(videoId, "video", "likeCountUpdated", { videoId, change });
      emitRoom(publisherId, "profile", "likeCountUpdated", change);
    });

    socket.on("updateSaveCount", ({ videoId, action }) => {
      const change = action === "save" ? 1 : -1;
      emitRoom(videoId, "video", "saveCountUpdated", { videoId, change });
    });

    socket.on("addFollow", async ({ followingId, followerId }) => {
      const notificationSaved = await NotificationServices.saveNotification({
        receiverId: followingId,
        type: "follow",
        senderId: followerId,
        message: "đã bắt đầu follow bạn",
        viewed: false,
      });
      emitOne(followingId, "followNotification", notificationSaved);
      emitOne(followerId, "followSuccess", {
        followerId,
        followingId,
        type: "follow",
      });
    });

    socket.on(
      "updateFollowCountOfProfile",
      ({ followerId, followingId, action }) => {
        console.log(
          "followerId, followingId, action:",
          followerId,
          followingId,
          action
        );
        const change = action === "follow" ? 1 : -1;
        emitRoom(followingId, "profile", "followCountOfProfileUpdated", {
          followerId,
          change,
        });
      }
    );

    socket.on("deletedFollow", ({ followerId, followingId, type }) => {
      emitOne(followerId, "unfollowSuccess", { followerId, followingId, type });
      emitOne(followingId, "checkFollowStatus", {
        followerId,
        followingId,
        type,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let [userId, storedSocketId] of userSocketMap.entries()) {
        if (storedSocketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`Removed mapping for user ${userId}`);
          break;
        }
      }
    });
  });

  return io;
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

const emitMany = (event, data) => {
  io.emit(event, data);
};

const emitRoom = (roomId, roomType, event, data) => {
  const fullRoomId = `${roomType}_${roomId}`;
  io.to(fullRoomId).emit(event, data);
};

const emitOne = (tiktokId, event, data) => {
  const socketId = userSocketMap.get(tiktokId);
  if (!socketId) {
    console.error(`emitOne failed: No socketId found for user ${tiktokId}`);
    return;
  }
  io.to(socketId).emit(event, data);
};

module.exports = { initSocket, getSocket, emitMany, emitRoom, emitOne };
