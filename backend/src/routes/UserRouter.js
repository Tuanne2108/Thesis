const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authToken");
const userController = require("../controllers/UserController");

//Request
router.put("/update-user/:id", authenticateToken, userController.updateUser);
router.delete("/delete-user/:id", authenticateToken, userController.deleteUser);
router.post("/become-seller", authenticateToken, userController.becomeSeller);
module.exports = router;
