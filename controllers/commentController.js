const CommentModel = require("../models/comment_model");
const TweetModel = require("../models/tweet_model");
const badWords = require("../utils/badWords");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllComment(req, res) {
  try {
    const allComment = await CommentModel.find({});
    return res.status(200).json(allComment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handlePostComment(req, res) {
  console.log(req.body);
  try {
    const incomingComment = req.body;
    const userId = req.user._id;
    const tweetId = req.params.id;

    console.log(userId);
    console.log(tweetId);
    // console.log(incomingComment);
    // console.log(userId);

    const words = incomingComment.content.toLowerCase().split(/\s+/);

    const containsBadWord = words.some((word) => badWords.includes(word));
    // console.log(containsBadWord);

    if (containsBadWord) {
      return res.status(403).json({
        message:
          "Your submission contains inappropriate language. You are permanently restricted from posting.",
      });
    }

    if (!incomingComment.content) {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const newComment = {
      author: userId,
      content: incomingComment.content,
      tweet: tweetId,
      attachment: incomingComment?.attachment,
    };
    const addComment = await CommentModel.create(newComment);

    // Update the tweet with the new comment ID
    const updatedTweet = await TweetModel.findByIdAndUpdate(
      tweetId,
      { $push: { comments: addComment._id } },
      { new: true }
    );

    if (!updatedTweet) {
      return res.status(404).json({ error: "Tweet not found." });
    }

    const returnUserComment = await TweetModel.findById(tweetId).populate(
      "comments"
    );
    // console.log("💖💖💖", returnUserComment);
    // Get the latest comment
    const latestComment =
      returnUserComment?.comments[returnUserComment?.comments.length - 1];

    return res.status(201).json({ latestComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({ error: "Failed to post comment." });
  }
}

async function handleDeleteCommentById(req, res) {
  const commentId = req.params?.id;
  const auth = req.user._id;

  try {
    const comment = await CommentModel.findById(commentId).populate("author");

    // console.log("comment ✖️✖️✖️", comment);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the author of the comment
    if (comment.author._id.toString() !== auth.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete the comment from the CommentModel
    await CommentModel.findByIdAndDelete(commentId);

    // Remove the comment ID from the TweetModel's comments array
    await TweetModel.updateOne(
      { comments: commentId }, // Locate the tweet containing the comment
      { $pull: { comments: commentId } } // Remove the comment ID from the array
    );

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleLikeCommentById(req, res) {
  //on Develop
  const commentId = req.params.id;
  const userId = req.user;

  console.log(userId);
  console.log(commentId);
}

module.exports = {
  handleGetAllComment,
  handlePostComment,
  handleDeleteCommentById,
  handleLikeCommentById,
};
