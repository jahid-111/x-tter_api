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

  const { userName, displayName, dateOfBirth, bio, website, profileImage } =
    req.body;

  // console.log(userName, displayName, bio, website, dateOfBirth, profileImage);
  try {
    const userUpdate = await UserModel.findByIdAndUpdate(
      userId,
      {
        userName,
        dateOfBirth,
        bio,
        website,
        profileImage,
        displayName,
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

const handleUserFollower = async (req, res) => {
  try {
    const myId = req.user._id;
    const userId = req.params.id;

    if (!myId || !userId) {
      return res.status(400).json({ error: "Invalid user IDs provided." });
    }

    // Fetch both users
    const [targetUser, itsMe] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(myId),
    ]);

    if (!targetUser || !itsMe) {
      return res.status(404).json({ error: "Users not found." });
    }

    // Check if already following
    const isFollow = targetUser.followers.some(
      (follower) => follower.toString() === myId.toString()
    );

    if (isFollow) {
      // Unfollow logic
      targetUser.followers = targetUser.followers.filter(
        (follower) => follower.toString() !== myId.toString()
      );
      itsMe.following = itsMe.following.filter(
        (following) => following.toString() !== userId.toString()
      );
    } else {
      // Follow logic
      targetUser.followers.push(myId);
      itsMe.following.push(userId);
    }

    // Save both users
    await Promise.all([targetUser.save(), itsMe.save()]);

    return res.status(200).json({
      itsMe_id: myId,
      targetPerson_Id: userId,
      IsFollowing: !isFollow,
    });
  } catch (error) {
    console.error("Error 🔴🔴  :", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  handleGetAllUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleUserFollower,
};
