const UserModel = require("../models/user_model");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllUser(req, res) {
  const userAll = await UserModel.find({});
  return res.status(200).json(userAll);
}

async function handleGetUserById(req, res) {
  const userId = req.params?.id;
  const user = await UserModel.findById(userId);
  return res.status(200).json(user);
}

async function handleUpdateUserById(req, res) {
  const userId = req.params?.id;
  const updates = req.body;
  try {
    const userUpdate = await UserModel.findByIdAndUpdate(
      userId,
      {
        userName: updates.userName,
        dateOfBirth: updates.dateOfBirth,
        password: updates.password,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators on the updated fields
      }
    );
    return res
      .status(200)
      .json({ message: "Update Successfully", updated: userUpdate });
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

async function handleDeleteUserById(req, res) {
  const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found." }); // Handle case where user does not exist
  }

  return res
    .status(200)
    .json({ message: "Delete Success", delUserData: deletedUser });
}

async function handleCreateNewUser(req, res) {
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

module.exports = {
  handleGetAllUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
