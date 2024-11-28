const CommentModel = require("../models/comment_model");
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
  const commentBody = req.body;
  console.log(commentBody);
  // error posting
  return res.status(200).json(commentBody);
}

module.exports = { handleGetAllComment, handlePostComment };
