const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    publisherId: { type: String, required: true },
    title: { type: String },
    cloudinary_public_id: { type: String, required: true },
    original_url: { type: String, required: true },
    hls_url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    hash: { type: String, required: true },
    music: { type: String, required: true },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

videoSchema.index({ publisherId: 1 });
videoSchema.index({ title: "text" });
videoSchema.index({ music: 1 });
videoSchema.index({ hash: 1 });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
