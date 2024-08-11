const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/SellerController");

//Request
router.get("/seller-info/:userId", sellerController.getSellerInfo);

module.exports = router;
