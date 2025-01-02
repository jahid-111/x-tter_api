const express = require("express");
const tokenVerifyController = require("../controllers/tokenVerifyController");

// --------------^^^^^^^^^^^^------------------------------- Modules
const router = express.Router();

router.route("/").get(tokenVerifyController);

module.exports = router;
