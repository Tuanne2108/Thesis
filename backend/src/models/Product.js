const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        category: { type: String, required: true },
        tags: [String],
        images: [String],
        inventory: {
            quantity: { type: Number, required: true },
            reserved: { type: Number, default: 0 },
        },
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
