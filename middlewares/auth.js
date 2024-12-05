const { getUser } = require("../services/JWTService");

async function restrictToLoggedUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;
  //   console.log("🍪🍪🍪", userUid);
  if (!userUid) {
    // console.log("🍪✖️ Not    Found", userUid);
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    const user = getUser(userUid);
    // console.log("🍪✔️🍪", user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    // console.error("Error in restrictToLoggedUserOnly:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
}

module.exports = { restrictToLoggedUserOnly };
