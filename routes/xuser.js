const express = require("express");

const {
  handleGetAllUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleUserFollower,
} = require("../controllers/userController");
// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleGetAllUser); //Root

router
  .route("/:id") //SINGLE CONTROL
  .get(handleGetUserById) //SINGLE User
  .patch(handleUpdateUserById) //USER Update
  .delete(handleDeleteUserById); //DELETE User

router.route("/:id/follow").put(handleUserFollower); //User Follow And UnFollow

module.exports = router;
