const { setUser } = require("../services/JWTService");
const UserModel = require("../models/user_model");

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
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: "None", // Allow cookies to be sent in cross-origin requests
      path: "/", // Make the cookie accessible across the entire domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
    };

    // Log for debugging (remove in production)
    console.log("Generated Token:", tokenJwt);
    console.log("Cookie Options:", cookieOptions);

    // Set the token in a secure cookie
    res.cookie("uid", tokenJwt, cookieOptions);

    // Send the user data response
    return res.status(200).json({
      userData: {
        userName: user.userName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      cookieOptions,
    });
  } catch (error) {
    console.error("Error during user sign-in:", error.message);

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
