const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        value: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        applicableProducts: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        ],
    },
    {
        timestamps: true,
    }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
