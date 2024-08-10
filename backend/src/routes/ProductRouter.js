const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

//Request
router.get("/get-products", productController.getProducts);
router.get("/get-product/:id", productController.getProductById);
router.post("/create-product", productController.createProduct);
router.put("/update-product/:id", productController.updateProduct);
router.delete("/delete-product/:id", productController.deleteProduct);

module.exports = router;
