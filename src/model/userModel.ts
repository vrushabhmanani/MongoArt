import mongoose from "mongoose";

const users = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Blocked', 'Deleted'],
        default: 'Active'
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: "User"
    }
}, {
    collection: "users",
    timestamps: true
})

module.exports = mongoose.model('users', users);