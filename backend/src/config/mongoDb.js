import 'dotenv/config';
import mongoose from 'mongoose';

const uri = "mongodb+srv://nguyenhoangminhtuan210802:gACEM6OdugU8byD0@cluster0.nyztxof.mongodb.net/web_db?retryWrites=true&w=majority";

export const connectMongoDB = async () => {
    try {
        await mongoose
            .connect(uri)
            .then(() => console.log("MongoDB connected..."));
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
