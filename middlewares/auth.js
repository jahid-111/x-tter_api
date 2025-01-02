const { getUser } = require("../services/JWTService");

async function restrictToLoggedUserOnly(req, res, next) {
  // Extract the token from the Authorization header
  const userUid = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  console.log("🍪 Headers Token:", userUid); // Debugging token

  // If no token is provided, return 401 Unauthorized error
  if (!userUid) {
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    // Verify token and retrieve the user
    const user = getUser(userUid);

    // If user is not found or token is invalid/expired, return 401 error
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found or token expired" });
    }

    // Attach the user to the request object for use in the route handler
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in restrictToLoggedUserOnly:", error);
    // Return a generic error message for any unexpected issues
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
}

module.exports = { restrictToLoggedUserOnly };
