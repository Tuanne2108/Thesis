const mongoose = require("mongoose");

const deliveryPersonnelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        contact: {
            phone: { type: String, required: true },
            email: { type: String },
        },
        assignedOrders: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        ],
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        status: {
            type: String,
            enum: ["available", "on-duty", "off-duty"],
            default: "available",
        },
        vehicle: {
            type: String,
            licensePlate: String,
        },
    },
    {
        timestamps: true,
    }
);

const DeliveryPersonnel = mongoose.model(
    "DeliveryPersonnel",
    deliveryPersonnelSchema
);

module.exports = DeliveryPersonnel;
