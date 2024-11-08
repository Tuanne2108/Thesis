const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signUp = async (req, res) => {
    try {
        const { email, password, confirmedPassword } = req.body;

        const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailRegEx.test(email)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid email format" });
        }
        if (password !== confirmedPassword) {
            return res
                .status(400)
                .json({ status: "error", message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ status: "error", message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: createdUser,
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Error creating user",
            data: null,
        });
    }
};

// const capture = async (req, res) => {
//     const { ip } = req.body;
//   console.log("Received IP address:", ip);
//   res.status(200).json({ message: "IP address received", ip });
// }
const signIn = async (req, res) => {
    try {
        const customerIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: customerIp,
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Error logging in user",
            data: null,
        });
    }
};

const googleSignIn = async (req, res) => {
    try {
        const { username, email, photo } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: "Strict",
            });

            const { password, ...rest } = user._doc;
            return res.status(200).json({
                status: "success",
                message: "User logged in successfully",
                data: rest,
            });
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const newUser = await User.create({
                username:
                    (username || "").split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar: photo,
            });

            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: "Strict",
            });
            const { password, ...rest } = newUser._doc;
            return res.status(201).json({
                status: "success",
                message: "User created and logged in successfully",
                data: rest,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};

const signOut = async (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.status(200).json({
            status: "success",
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "Refresh token not provided" });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: "Invalid refresh token" });
                }

                const accessToken = jwt.sign(
                    { id: user.id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRATION }
                );

                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });

                return res.status(200).json({ message: "Token refreshed" });
            }
        );
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
};
module.exports = { signUp, signIn, googleSignIn, signOut, refreshToken };
