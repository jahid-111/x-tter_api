const { getUser } = require("../services/JWTService");

async function tokenVerifyController(req, res) {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  console.log(token);
  try {
    // Verify token and get user info
    const user = getUser(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Respond with success if the token is valid
    return res.status(200).json({ message: "Token is valid", user });
  } catch (error) {
    console.error("Error during token verification:", error);
    return res
      .status(500)
      .json({ message: "Server error during token verification" });
  }
}

module.exports = tokenVerifyController;
