const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied, no token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user;
        next();
    });
};

const authorizeToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Access denied, no token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        if (user.role !== "seller") {
            return res.status(403).json({
                status: "error",
                message: "Access denied, not a seller",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};
module.exports = { authenticateToken, authorizeToken };
