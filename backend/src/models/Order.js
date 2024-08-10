const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            required: true,
        },
        deliveryStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered"],
            required: true,
        },
        shippingAddress: addressSchema,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
