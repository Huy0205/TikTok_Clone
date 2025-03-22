const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
  {
    saverId: { type: String, required: true }, // người lưu
    videoId: { type: String, required: true }, // video được lưu
  },
  { timestamps: true }
);

saveSchema.index({ saverId: 1, videoId: 1 }, { unique: true });

const Save = mongoose.model("Save", saveSchema);

module.exports = Save;
