const express = require("express");
const {
  handleGetAllComment,
  handlePostComment,
  handleDeleteCommentById,
} = require("../controllers/commentController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllComment).post(handlePostComment);

router.route("/:id").delete(handleDeleteCommentById);

module.exports = router;
