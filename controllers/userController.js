const UserModel = require("../models/user_model");

// --------------^^^^^^^^^^^^------------------------------- Modules

async function handleGetAllUser(req, res) {
  try {
    const user = await UserModel.find({}).select("-password -salt");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleGetUserById(req, res) {
  try {
    const userId = req.params?.id;

    const user = await UserModel.findById(userId).select("-password -salt");
    if (!user) {
      return res.status(400).json({ message: "User not  Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleUpdateUserById(req, res) {
  const userId = req.params?.id; // The ID of the user to update
  const auth = req.user._id; // Authenticated user's ID from middleware

  const { userName, displayName, dateOfBirth, bio, website, profileImage } =
    req.body;

  try {
    // Authorization check: Allow update only if the user owns the profile
    if (auth.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You can't update this user." });
    }

    // console.log(userName, displayName, bio, website, dateOfBirth, profileImage);

    // Update the user
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
        runValidators: true, // Ensure validators are run for updated fields
      }
    ).select("-password -salt");

    if (!userUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Updated successfully", updated: userUpdate });
  } catch (error) {
    console.error(error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(403).json({ message: "Duplicate field value.", error });
    }

    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    const userId = req.params.id;
    const auth = req.user._id;

    // Check if the authenticated user matches the ID to be deleted
    if (userId.toString() !== auth.toString()) {
      return res.status(401).json({ message: "Not authorized to delete user" });
    }

    // Clear cookie
    res.clearCookie("uid");

    // Delete the user
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("User Deleted");
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
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
    console.error("Error 🔴🔴:", error);
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
