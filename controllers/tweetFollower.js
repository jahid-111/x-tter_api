async function handleTweetFollow(req, res) {
  const userId = req.body;

  return res.status(200).json(userId);
}
