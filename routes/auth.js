const express = require("express");
const {
  handleUserSignin,
  handleUserSignup,
} = require("../controllers/authController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/signin").post(handleUserSignin);
router.route("signup").post(handleUserSignup); //USER AUTH

module.exports = router;
