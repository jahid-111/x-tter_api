const { setUser } = require("../services/JWTService");
const UserModel = require("../models/user_model");
require("dotenv").config();

async function handleUserSignin(req, res) {
  const { email, password } = req.body;

  // Validate the request body
  if (!req.body || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Verify the user credentials
    const user = await UserModel.mathPassword(email, password);

    // Generate a JWT token
    const tokenJwt = setUser(user);

    // Define cookie options
    const cookieOptions = {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax", // Allows cookies for same-site requests and top-level navigation
      domain:
        process.env.NODE_ENV === "development"
          ? "localhost"
          : ".twitter-x-snowy.vercel.app", // Adjust to match your domain
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Set the cookie and send the response
    res.cookie("uid", tokenJwt, cookieOptions);

    // Log for debugging (remove in production)
    console.log("Generated Token:", tokenJwt);
    console.log("Cookie Options:", cookieOptions);

    // Send the user data response
    return res.status(200).json({
      success: true,
      userData: {
        userName: user.userName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error during user sign-in:", error.message);

    // Send the error response
    return res.status(401).json({
      message: error.message,
    });
  }
}

async function handleUserSignup(req, res) {
  const newUser = req.body;

  if (
    !newUser ||
    !newUser.userName ||
    !newUser.email ||
    !newUser.password ||
    !newUser.dateOfBirth
  ) {
    return res.status(400).json({ message: "All Fields Required" });
  }

  // console.log(newUser.userName);

  try {
    const response = await UserModel.create({
      userName: newUser.userName,
      email: newUser.email,
      password: newUser.password,
      dateOfBirth: newUser.dateOfBirth,
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
      .json({ message: "Create Successfully", createdData });
  } catch (error) {
    // console.log(error);
    if (error.code === 11000) {
      res.status(409).json(error);
    } else {
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

module.exports = { handleUserSignup, handleUserSignin };
