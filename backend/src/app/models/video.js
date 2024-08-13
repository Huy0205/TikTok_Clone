const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    publisherId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    music: { type: String, required: true },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

videoSchema.index({ publisherId: 1 });
videoSchema.index({ title: "text" });
videoSchema.index({ music: 1 });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
