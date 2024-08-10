const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["order", "promotion", "general"],
            required: true,
        },
        message: { type: String, required: true },
        status: { type: String, enum: ["unread", "read"], default: "unread" },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
