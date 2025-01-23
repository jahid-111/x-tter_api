const TweetModel = require("../models/tweet_model");
const UserModel = require("../models/user_model");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllTweet(req, res) {
  try {
    // Fetch tweets and populate the 'author' field with user details
    const tweets = await TweetModel.find({}).populate(
      "author",
      "userName email"
    ); // Populate only the
    console.log(tweets);
    return res.status(200).json(tweets);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleGetTweetById(req, res) {
  try {
    const tweetId = req.params?.id;
    const tweet = await TweetModel.findById(tweetId).populate(
      "author",
      "userName email"
    );
    res.status(200).json(tweet);
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleUpdateTweet(req, res) {
  const tweetId = req.params?.id;
  const updates = req.body;
  const auth = req.user._id;

  try {
    const tweet = await TweetModel.findById(tweetId);

    // console.log("✖️✖️✖️✖️", tweet.content);
    if (updates.content?.trim() === tweet.content?.trim()) {
      return res.status(409).json({
        message: "The new content is the same as the current content.",
      });
    }
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (auth.toString() !== tweet.author.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to Update this tweet" });
    }
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
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
// 🥰🥰🥰
async function handleCreateNewTweet(req, res) {
  const incomingTweet = req.body;

  try {
    if (!incomingTweet.content) {
      return res.status(400).json({ message: "Content is required." });
    }

    const newTweet = await TweetModel.create({
      content: incomingTweet.content,
      contentInfo: incomingTweet.contentInfo,
      author: incomingTweet.userId,
    });

    await UserModel.findByIdAndUpdate(
      incomingTweet.userId, // Pass `userId` from the request
      { $push: { tweet: newTweet._id } }, // Push the new tweet's ID
      { new: true }
    );

    const updatedUser = await UserModel.findById(incomingTweet.userId).populate(
      "tweet"
    );
    const latestTweet = updatedUser?.tweet[updatedUser?.tweet.length - 1];

    // Respond with the latest tweet
    return res.status(201).json({ latestTweet });
  } catch (error) {
    console.error("Error creating tweet:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleDeleteTweetById(req, res) {
  const tweetId = req.params?.id;
  const auth = req.user._id;

  try {
    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (auth.toString() !== tweet.author.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this tweet" });
    }

    // Delete the tweet
    const deletedTweet = await TweetModel.findByIdAndDelete(tweetId);

    // Remove the tweet reference from the author's document
    await UserModel.findByIdAndUpdate(auth, {
      $pull: { tweet: tweetId },
    });

    // console.log("Deleted tweet:", deletedTweet);

    return res.status(200).json({
      message: "Tweet deleted successfully",
      deletedTweet,
    });
  } catch (error) {
    console.error("Error deleting tweet:", error);
    return res.status(500).json({ message: "Failed to delete tweet" });
  }
}

async function handleLikeTweetById(req, res) {
  const { tweetId, userId } = req.body.payload;

  try {
    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // console.log(tweet)
    // Check if the user has already liked the tweet
    console.log("TEST 🥲🥲", tweet.likes);
    const isLiked = tweet.likes.includes(userId);
    console.log(isLiked);

    if (isLiked) {
      // Remove the like (unlike)
      tweet.likes = tweet.likes.filter(
        (likedUserId) => likedUserId.toString() !== userId
      );
    } else {
      // Add the like
      tweet.likes.push(userId);
    }

    await tweet.save();

    return res.status(200).json({
      message: isLiked ? "Unliked" : "Liked",
      isLiked: isLiked,
      tweetId,
      userId,
    });
  } catch (error) {
    console.error("Like/Unlike Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
const handleRetweetPost = async (req, res) => {
  const userId = req.user._id;
  const tweetId = req.params.id;
  // console.log(userId);

  try {
    const retweeted = await TweetModel.findByIdAndUpdate(
      tweetId,
      { $push: { retweets: userId } },
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { retweet: tweetId } },
      { new: true }
    );

    if (!retweeted) {
      return res.status(404).json({ message: "Tweet not found" });
    }
    // console.log(retweeted);
    res.status(200).json({ message: "Retweeted successfully", retweeted });
  } catch (error) {
    console.error("Error 🔴🔴", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleGetAllTweet,
  handleGetTweetById,
  handleUpdateTweet,
  handleCreateNewTweet,
  handleDeleteTweetById,
  handleLikeTweetById,
  handleRetweetPost,
};
