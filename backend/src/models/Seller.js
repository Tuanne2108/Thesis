const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shopName: { type: String, required: true },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        totalRevenue: { type: Number, default: 0 },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
