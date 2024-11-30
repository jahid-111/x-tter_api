const TweetModel = require("../models/tweet_model");
const UserModel = require("../models/user_model");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllTweet(req, res) {
  const tweets = await TweetModel.find({});
  return res.status(200).json(tweets);
}

async function handleGetTweetById(req, res) {
  const tweetId = req.params?.id;
  const tweet = await TweetModel.findById(tweetId);
  res.status(200).json(tweet);
}

async function handleUpdateTweet(req, res) {
  const tweetId = req.params?.id;
  const updates = req.body;
  console.log(updates);
  try {
    const tweetUpdate = await TweetModel.findByIdAndUpdate(
      tweetId,
      { content: updates.content },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators on the updated fields
      }
    );

    return res.status(200).json(tweetUpdate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json(error);
    } else {
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

async function handleCreateNewTweet(req, res) {
  const incomingTweet = req.body;

  const newTweet = await TweetModel.create({
    content: incomingTweet.content,
    contentInfo: incomingTweet.contentInfo,
    author: req.user._id,
  });

  await UserModel.findByIdAndUpdate(
    req.user._id,
    { $push: { tweet: newTweet._id } },
    { new: true }
  );

  const returnUserTweet = await UserModel.findById(req.user._id).populate(
    "tweet"
  );
  const latestTweet = returnUserTweet?.tweet[returnUserTweet?.tweet.length - 1];
  // console.log(returnUserTweet);
  res.status(201).json({ latestTweet });
}

async function handleDeleteTweetById(req, res) {
  const tweetId = req.params?.id;

  const deleteTweet = await TweetModel.findByIdAndDelete(tweetId);

  if (!deleteTweet) {
    return res.status(404).json({ message: "Tweet Not Found" });
  }

  return res
    .status(200)
    .json({ message: "Delete  Success", delTweetData: deleteTweet });
}

async function handleLikeTweetById(req, res) {
  const tweetId = req.params.id;
  const userId = req.user._id;

  // console.log(tweetId);
  // console.log("user ID", userId);
  try {
    const tweet = await TweetModel.findById(tweetId);

    //Checking Like
    const isLiked = tweet.likes.some(
      (like) => like._id.toString() === userId.toString()
    );

    if (isLiked) {
      //Filter each put request
      tweet.likes = tweet.likes.filter(
        (like) => like._id.toString() !== userId.toString()
      );

      await tweet.save();
      return res
        .status(200)
        .json({ message: "Unliked", isLiked: false, tweetId, userId });
    } else {
      tweet.likes.push(userId);
      await tweet.save();
      return res
        .status(200)
        .json({ message: "Liked", isLiked: true, tweetId, userId });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

module.exports = {
  handleGetAllTweet,
  handleGetTweetById,
  handleUpdateTweet,
  handleCreateNewTweet,
  handleDeleteTweetById,
  handleLikeTweetById,
};
