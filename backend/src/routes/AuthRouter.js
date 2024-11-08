const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

//Request
// router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
// router.post("/capture-ip", authController.capture);
// router.post("/google", authController.googleSignIn);
// router.get("/sign-out", authController.signOut);
//Refresh token
// router.get("/refresh-token", authController.refreshToken);

module.exports = router;