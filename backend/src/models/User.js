const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
            required: true,
        },
        profile: {
            firstName: { type: String },
            lastName: { type: String },
            address: addressSchema,
            phone: { type: String },
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
