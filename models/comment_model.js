const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xusers",
      required: true,
    },
    attachment: {
      type: String,
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweets",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Self-referencing field for replies
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.comment || mongoose.model("comment", CommentSchema);

module.exports = CommentModel;
