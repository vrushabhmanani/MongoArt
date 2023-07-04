"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let post = new mongoose_1.default.Schema({
    postname: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
}, {
    collection: "entries",
    timestamps: true
});
module.exports = mongoose_1.default.model('post', post);
