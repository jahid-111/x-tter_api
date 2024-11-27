const TweetModel = require("../models/tweet_model");

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
    author: incomingTweet.author, //Should  Mongoose  obj
    contentInfo: incomingTweet.contentInfo,
  });
  res.status(201).json(newTweet);
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
module.exports = {
  handleGetAllTweet,
  handleGetTweetById,
  handleUpdateTweet,
  handleCreateNewTweet,
  handleDeleteTweetById,
};
