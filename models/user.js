const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please provide a valid email"],
        lowercase: true, 
    },
    
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "saler"], 
        default: "user",
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password, 12); 
    next();
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    const saltRounds = 12; 
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});
userSchema.pre('save', function (next) {
    if (this.isNew) { 
        this.role = 'user';
    }
    next();
});
module.exports = mongoose.model("User", userSchema);