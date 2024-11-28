const express = require("express");
const {
  handleGetAllComment,
  handlePostComment,
} = require("../controllers/commentController");

const router = express.Router();

router.route("/").get(handleGetAllComment).post(handlePostComment);

// router.route("/:id").;

module.exports = router;
