const { Notification } = require("../models");

const getNotificationByReceiverId = async (receiverId) => {
  try {
    const notifications = await Notification.find({ receiverId }).sort({
      updatedAt: -1,
    });
    return {
      status: 200,
      code: "OK",
      data: notifications,
    };
  } catch (error) {
    console.log("Error getting notification by receiverId:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const saveNotification = async (notification) => {
  try {
    const { type, senderId, receiverId } = notification;

    const updatedNotification = await Notification.findOneAndUpdate(
      { type, senderId, receiverId },
      { $set: notification },
      { upsert: true, new: true }
    );

    return updatedNotification;
  } catch (error) {
    console.error("Error saving notification:", error);
    return null;
  }
};

const updateViewedById = async (id, viewed) => {
  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      {
        _id: id,
      },
      { $set: { viewed } },
      { new: true }
    );
    return {
      status: 200,
      code: "OK",
      data: updatedNotification,
    };
  } catch (error) {
    console.log("Error updating viewed by id:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

module.exports = {
  saveNotification,
  getNotificationByReceiverId,
  updateViewedById,
};
