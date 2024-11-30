import mongoose from 'mongoose';
import { randomUUID } from "crypto";

const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => randomUUID(),
  },
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});


const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
    {
        username: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true,
        },
        profile: {
            firstName: { type: String },
            lastName: { type: String },
            address: addressSchema,
            phone: { type: String },
        },
        chats: {
          type: [chatSchema],
          default: []
      }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
