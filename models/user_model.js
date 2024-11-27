const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      // type: Date, for Production Type
      required: true,
    },
    displayName: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    tweet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tweets",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sessionId: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model.xusers || mongoose.model("xusers", userSchema);

module.exports = UserModel;
