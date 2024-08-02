const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

//Request
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
// router.post("/log-out", authController.logOut);

module.exports = router;