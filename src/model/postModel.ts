import mongoose from "mongoose";

let post = new mongoose.Schema({
    postname: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
},{ 
    collection: "entries",
    timestamps: true
});

module.exports = mongoose.model('post', post);
