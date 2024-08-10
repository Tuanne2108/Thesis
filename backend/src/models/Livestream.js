const mongoose = require("mongoose");

const LivestreamSchema = new mongoose.Schema({
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    scheduled_start: { type: Date, required: true },
    actual_start: { type: Date },
    actual_end: { type: Date },
    status: {
        type: String,
        enum: ["scheduled", "live", "ended"],
        required: true,
    },
});

module.exports = mongoose.model("Livestream", LivestreamSchema);
