const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try {
        const { email, password, confirmedPassword } = req.body;
        const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailRegEx.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
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
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Error creating user",
            data: null,
        });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        res.cookie("access_token", token, {
            httpOnly: true,
        });
        const { password: pass, ...rest } = user._doc;
        return res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: rest,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Error logging in user",
            data: null,
        });
    }
};

module.exports = { signUp, signIn };
