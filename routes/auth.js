const express = require("express");
const {
  handleUserSignin,
  handleUserSignup,
} = require("../controllers/authController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleUserSignin).post(handleUserSignup);

module.exports = router;
