const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
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
        amount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "paypal", "bank_transfer"],
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failed", "pending"],
            required: true,
        },
        transactionId: { type: String, unique: true },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
