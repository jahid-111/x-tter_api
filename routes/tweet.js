const express = require("express");
const {
  handleGetAllTweet,
  handleGetTweetById,
  handleUpdateTweet,
  handleCreateNewTweet,
  handleDeleteTweetById,
  handleLikeTweetById,
  handleRetweetPost,
} = require("../controllers/tweetController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllTweet).post(handleCreateNewTweet); //Root

router
  .route("/:id") //SINGLE CONTROL
  .get(handleGetTweetById) // GET Single Tweet
  .patch(handleUpdateTweet) //  EDIT Single Tweet
  .delete(handleDeleteTweetById); //DELETE Single Tweet

router.route("/:id/like").put(handleLikeTweetById); //LIKE Single Tweet

router.route("/:id/retweet").post(handleRetweetPost); //SHARE a Tweet

module.exports = router;
