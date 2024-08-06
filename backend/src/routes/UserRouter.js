const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyUser");
const userController = require("../controllers/UserController");

//Request
router.put("/update-user/:id", verifyToken, userController.updateUser);
router.delete("/delete-user/:id", verifyToken, userController.deleteUser);
module.exports = router;
