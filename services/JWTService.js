const jwt = require("jsonwebtoken");

require("dotenv").config();

function setUser(user) {
  if (!user._id || !user.email) {
    throw new Error("User object must contain _id and email.");
  }
  const payload = { _id: user._id, email: user.email };
  const options = { expiresIn: "1h" }; // Expiry time for the token (1 hour)

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}

function getUser(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

module.exports = { setUser, getUser };
