const express = require("express");
const {
  handleUserSignin,
  handleUserSignup,
} = require("../controllers/authController");

// --------------^^^^^^^^^^^^------------------------------- Modules

const router = express.Router();

router.route("/").get(handleUserSignin).post(handleUserSignup); //USER AUTH

module.exports = router;
