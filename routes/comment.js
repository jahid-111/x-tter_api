const express = require("express");
const {
  handleGetAllComment,
  handlePostComment,
  handleDeleteCommentById,
  handleLikeCommentById,
} = require("../controllers/commentController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllComment).post(handlePostComment);

router.route("/:id").delete(handleDeleteCommentById);

router.route("/:id/like", handleLikeCommentById);

router.route("/:id/comment").post(handlePostComment);

module.exports = router;
