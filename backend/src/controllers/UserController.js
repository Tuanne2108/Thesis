const User = require("../models/User");

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

const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized",
        });
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        return res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error deleting user",
        });
    }
};

module.exports = { updateUser, deleteUser };
