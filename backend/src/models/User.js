const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        avatar:{ type: String, default:"https://cdn-icons-png.flaticon.com/512/6596/6596121.png"},
        role: { type: String, default: "user" },
    },
    { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
