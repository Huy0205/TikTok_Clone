const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    LikerId: { type: String, required: true }, // người like
    videoId: { type: String, required: true }, // video được like
  },
  { timestamps: true }
);

likeSchema.index({ likerId: 1 });
likeSchema.index({ videoId: 1 });
likeSchema.index({ likerId: 1, videoId: 1 }, { unique: true });


const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
