const jwt = require("jsonwebtoken");

require("dotenv").config();

function setUser(user) {
  if (!user._id || !user.email) {
    throw new Error("User object must contain _id and email.");
  }
  const payload = { _id: user._id, email: user.email };
  const options = { expiresIn: "1h" }; // Expiry time for the token (1 hour)
  const encode = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
  // console.log("Pay load --", encode);
  return encode;
}

function getUser(token) {
  try {
    // console.log("Token to verify:😍", JSON.parse(token)); // Log token here
    const user = jwt.verify(JSON.parse(token), process.env.JWT_SECRET_KEY);
    // console.log("Decoded user:", user); // Log decoded user
    return user;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

module.exports = { setUser, getUser };
