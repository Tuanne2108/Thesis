const express = require("express");
const router = express.Router();
const { authorizeToken } = require("../middleware/authToken");
const productController = require("../controllers/ProductController");

//Request
router.get("/get-products", productController.getProducts);
router.get("/get-product/:id", productController.getProductById);
router.get(
    "/get-products-by-seller/:sellerId",
    productController.getProductsBySellerId
);
router.post("/create-product", authorizeToken, productController.createProduct);
router.put(
    "/update-product/:id",
    authorizeToken,
    productController.updateProduct
);
router.delete(
    "/delete-product/:id",
    authorizeToken,
    productController.deleteProduct
);

module.exports = router;
