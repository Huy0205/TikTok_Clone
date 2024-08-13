const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    tiktokId: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ tiktokId: "text", nickname: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
