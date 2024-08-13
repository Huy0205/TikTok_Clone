const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    followerId: { type: String, required: true }, // người theo dõi
    followingId: { type: String, required: true }, // người được theo dõi
  },
  { timestamps: true }
);

followSchema.index({ followerId: 1 });
followSchema.index({ followingId: 1 });
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
