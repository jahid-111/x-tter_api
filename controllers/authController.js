const { setUser } = require("../services/authService");
const UserModel = require("../models/user_model");

async function handleUserSignin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    // console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const tokeJwt = setUser(user);
    res.cookie("uid", tokeJwt, {
      httpOnly: true, // Prevent client-side access to cookies for security
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin behavior
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });

    return res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error in handleUserSignin:", error.message, error.stack);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
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

    return res
      .status(201)
      .json({ message: "Create Successfully", createdData: response });
  } catch (error) {
    if (error.code === 11000) {
      res.status(403).json(error);
    } else {
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

module.exports = { handleUserSignup, handleUserSignin };
