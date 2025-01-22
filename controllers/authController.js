const { setUser } = require("../services/JWTService");
const UserModel = require("../models/user_model");

async function handleUserSignin(req, res) {
  const { email, password } = req.body;

  if (!req.body || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.mathPassword(email, password);

    const tokenJwt = setUser(user); // Set For Bearer token
    // console.log("tokenJwt =>>>>>> ", tokenJwt);

    // Add token to response headers

    // Send user data
    return res.status(200).json({
      userData: {
        userName: user.userName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: {
        tokenJwt,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Invalid credentials. Please try again.",
    });
  }
}

async function handleUserSignup(req, res) {
  const newUser = req.body;
  // console.log(newUser);
  console.log(newUser);
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
      console.log(error);
      return res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

module.exports = { handleUserSignup, handleUserSignin };
