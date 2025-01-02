const UserModel = require("../models/user_model");

async function handleSocialLogin(req, res) {
  try {
    const { displayName, email, photosURL, providerId } = req.body;

    // Validate input
    if (!displayName || !email || !providerId) {
      return res.status(400).json({
        error: "Missing required fields: displayName, email, providerId,",
      });
    }

    // Check if user already exists
    const user = await UserModel.create({
      userName: displayName,
      email,
      providerId,
      profileImage: photosURL,
    });
    console.log("✨ New user created:", user);

    // Send response to the client
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error during social login:", error.message || error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing the request",
    });
  }
}

module.exports = { handleSocialLogin };
