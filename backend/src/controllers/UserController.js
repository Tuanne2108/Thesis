const User = require("../models/User");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized",
        });
    }

    try {
        const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (req.body.email && !emailRegEx.test(req.body.email)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid email format",
            });
        }

        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exists",
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error updating user",
        });
    }
};

module.exports = { updateUser };
