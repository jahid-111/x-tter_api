const express = require("express");
const { handleSocialLogin } = require("../controllers/socialController");

const router = express.Router();

router.route("/social").post(handleSocialLogin);

module.exports = router;
