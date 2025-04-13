const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    receiverId: { type: String, required: true },
    type: {
      type: String,
      enum: ["like_video", "follow"],
      required: true,
    },
    senderId: { type: String, required: true },
    target: { type: mongoose.Schema.Types.Mixed },
    message: { type: String, required: true },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
