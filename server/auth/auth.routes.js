const express = require("express");
const { refresh, register, login } = require("./auth.controller");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);

module.exports = router;
