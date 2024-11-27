const express = require("express");
const {
  handleGetAllTweet,
  handleGetTweetById,
  handleUpdateTweet,
  handleCreateNewTweet,
  handleDeleteTweetById,
} = require("../controllers/tweetController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllTweet).post(handleCreateNewTweet);

router
  .route("/:id")
  .get(handleGetTweetById)
  .patch(handleUpdateTweet)
  .delete(handleDeleteTweetById);

module.exports = router;
