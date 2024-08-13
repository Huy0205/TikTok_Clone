const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
  {
    watcherId: { type: String, required: true },
    videoId: { type: String, required: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

watchHistorySchema.index({ watcherId: 1 });
watchHistorySchema.index({ videoId: 1 });
watchHistorySchema.index({ watcherId: 1, videoId: 1 }, { unique: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

module.exports = WatchHistory;
