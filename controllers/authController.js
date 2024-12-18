const { setUser } = require("../services/JWTService");
const UserModel = require("../models/user_model");

async function handleUserSignin(req, res) {
  const { email, password } = req.body;

  if (!req.body || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.mathPassword(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const tokenJwt = setUser(user);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("uid", tokenJwt, {
      httpOnly: true,
      secure: isProd, // Required for HTTPS in production
      sameSite: isProd ? "None" : "Lax", // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      domain: isProd ? "twitter-x-snowy.vercel.app" : "localhost", // Correct domain
      path: "/", // Set for all routes
    });

    return res.status(200).json({
      userData: {
        userName: user.userName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error during user sign-in L-40:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleUserSignup(req, res) {
  const { userName, email, password, dateOfBirth } = req.body;

  if (!req.body || !userName || !email || !password || !dateOfBirth) {
    return res.status(400).json({ message: "All Fields Required" });
  }

  try {
    const response = await UserModel.create({
      userName,
      email,
      password,
      dateOfBirth,
    });

    const createdData = {
      userName: response.userName,
      email: response.email,
      dateOfBirth: response.dateOfBirth,
      profileImage: response.profileImage,
      createdAt: response.createdAt,
    };

    return res
      .status(201)
      .json({ message: "Created Successfully", createdData });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      console.error("Error during user sign-up:", error.message);
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

module.exports = { handleUserSignup, handleUserSignin };
