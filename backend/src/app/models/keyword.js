const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

keywordSchema.index({ content: "text" });

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword;
