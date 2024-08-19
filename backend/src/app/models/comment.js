const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentatorId: { type: String, required: true },
    videoId: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: [String], default: [] },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  { timestamps: true }
);

commentSchema.index({ commentatorId: 1 });
commentSchema.index({ videoId: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
