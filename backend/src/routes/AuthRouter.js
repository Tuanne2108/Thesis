const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

//Request
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/google", authController.googleSignIn);
router.get("/sign-out", authController.signOut);

module.exports = router;