const CommentModel = require("../models/comment_model");
const TweetModel = require("../models/tweet_model");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllComment(req, res) {
  try {
    const allComment = await CommentModel.find({});
    return res.status(200).json(allComment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
}

async function handlePostComment(req, res) {
  try {
    const incomingComment = req.body;
    const userId = req.user._id;
    const tweetId = req.params.id;

    // console.log(incomingComment);
    // console.log(userId);

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
  // console.log(commentId);

  try {
    const deleteComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deleteComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // console.log("💖💖 Comment deleted successfully");
    return res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
}

async function handleLikeCommentById(req, res) {
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
