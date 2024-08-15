const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            status: "success",
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
            data: null,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
            data: null,
        });
    }
};
const getProductsBySellerId = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ sellerId: sellerId });
        res.status(200).json({
            status: "success",
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
            data: null,
        });
    }
};
const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        discount,
        category,
        tags,
        images,
        inventory: { quantity, reserved },
    } = req.body;
    try {
        if (!name || !price || !category || !quantity) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields",
            });
        }
        const existingProduct = await Product.findOne({
            name,
            sellerId: req.user._id,
        });

        if (existingProduct) {
            return res.status(409).json({
                status: "error",
                message: "A product with this name already exists.",
            });
        }
        const createdProduct = await Product.create({
            sellerId: req.user._id,
            name,
            description,
            price,
            discount,
            category,
            tags,
            images,
            inventory: {
                quantity,
                reserved,
            },
        });
        res.status(201).json({
            status: "success",
            message: "Product created successfully",
            data: createdProduct,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductsBySellerId,
    createProduct,
    updateProduct,
    deleteProduct,
};
