const jwt = require("jsonwebtoken");

require("dotenv").config();

function setUser(user) {
  if (!user._id || !user.email) {
    throw new Error("User object must contain _id and email.");
  }
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY
  );
}
function getUser(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { setUser, getUser };
