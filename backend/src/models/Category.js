const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
