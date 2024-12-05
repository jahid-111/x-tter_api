const mongoose = require("mongoose");

const {
  hashedUserPassword,
  matchUserSaltHashPass,
} = require("../middlewares/passwordHashMongo");

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
    salt: {
      type: String,
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
      default: "/images/defaultUserAvatar.png",
    },
    tweet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tweets",
      },
    ],
    retweet: {
      type: String,
      ref: "tweet",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "xusers",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "xusers",
      },
    ],
    sessionId: {
      type: String,
    },
  },
  { timestamps: true }
);

//Mongoose-----------------------------------|-Middlewares-|
userSchema.pre("save", hashedUserPassword);

userSchema.static("mathPassword", matchUserSaltHashPass);

const UserModel = mongoose.model.xusers || mongoose.model("xusers", userSchema);

module.exports = UserModel;
