const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "xuser" },
    comment: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "xusers" }],
    retweets: [{ type: mongoose.Types.ObjectId, ref: "xusers" }],
    media: [{ type: String }], //ref indeed
    replies: [{ type: mongoose.Types.ObjectId, ref: "xusers" }],
  },
  { timestamps: true }
);

const TweetModel =
  mongoose.model.tweets || mongoose.model("tweets", TweetSchema);

module.exports = TweetModel;
