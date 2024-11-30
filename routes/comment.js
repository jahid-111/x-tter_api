const express = require("express");
const {
  handleGetAllComment,
  handlePostComment,
  handleDeleteCommentById,
  handleLikeCommentById,
} = require("../controllers/commentController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllComment).post(handlePostComment); //Root

router.route("/:id").delete(handleDeleteCommentById); //SINGLE Comment Delete

router.route("/:id/like", handleLikeCommentById); //LIKE Single Comment

router.route("/:id/comment").post(handlePostComment); //ref : TweetModel

module.exports = router;
