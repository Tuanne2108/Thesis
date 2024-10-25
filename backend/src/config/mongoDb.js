require("dotenv").config();
const mongoose = require("mongoose");
const uri = "mongodb+srv://nguyenhoangminhtuan210802:gACEM6OdugU8byD0@cluster0.nyztxof.mongodb.net/web_db?retryWrites=true&w=majority";

const connectMongoDB = async () => {
    try {
        await mongoose
            .connect(uri)
            .then(() => console.log("MongoDB connected..."));
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
module.exports = { connectMongoDB };