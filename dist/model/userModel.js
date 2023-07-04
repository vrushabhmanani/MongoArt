"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const users = new mongoose_1.default.Schema({
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
});
module.exports = mongoose_1.default.model('users', users);
