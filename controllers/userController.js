const User=require("../models/user")
const mongodb=require('mongodb')
const bcrypt =require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config(); 
signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 12); 
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword 
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
        console.log("User found in database:", user);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        console.log("Comparing passwords:");
        console.log("Candidate password (entered by user):", password);
        console.log("Stored hash:", user.password);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password is valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        const { password: _, ...safeUser } = user.toObject();
        res.status(200).json({
            message: "Authentication successful.",
            user: safeUser,
            token: token, 
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
updateUser=async(req,res)=>{
    try {
        const updateUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updateUser)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
 checkAdmin = async (req,res) => {
try {
    const {userId}=req.params
    console.log(userId)
    const user = await User.findById(userId);
    if (user.role !== "admin") {
        throw new Error("Access denied. Admins only.");
    }
   res.status(200).json(user)
} catch (error) {
    res.status(404).json(error.message)
}
};
forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        console.log("Received email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Email not found in database:", email);
            return res.status(404).json({ error: 'Email not found' });
        }
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated reset token:", resetToken);
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetToken = hashedToken;
        user.resetTokenExpires = Date.now() + 3600000; 
        await user.save();
        console.log("User reset token saved in DB.");
        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
        console.log("Password reset link:", resetLink);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n\n${resetLink}`,
        };
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent.');

        res.status(200).json({
            message: 'Password reset link sent to your email.',
        });
    } catch (error) {
        console.error('Error during forgotPassword:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};
resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (Date.now() > user.resetTokenExpires) {
            return res.status(400).json({ error: "Reset token has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Password reset successfully.',
        });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
};
module.exports = {
    signUp,
    loginUser,
    updateUser, 
    checkAdmin,
    forgotPassword,
    resetPassword
};