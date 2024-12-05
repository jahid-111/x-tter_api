const { setUser } = require("../services/JWTService");
const UserModel = require("../models/user_model");

async function handleUserSignin(req, res) {
  const { email, password } = req.body;

  if (!req.body || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.mathPassword(email, password);

    // Generate a JWT token
    const tokenJwt = setUser(user);

    // Set the token in a secure cookie
    res.cookie("uid", tokenJwt, {
      httpOnly: true, // Prevent client-side access to cookies for security
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin behavior
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
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
    // console.error("Error during user sign-in:", error.message);

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
