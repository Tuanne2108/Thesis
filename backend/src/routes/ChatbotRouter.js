const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

//Request
router.post('/chat', chatController.handleChatRequest);

module.exports = router;