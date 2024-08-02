const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        role: { type: String, default: "user" },
    },
    { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
