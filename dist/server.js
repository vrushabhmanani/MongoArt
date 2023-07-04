"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const connectDB = require('./config/dbConfig');
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/API/v1/', require('./controller/usersController'));
app.use('/API/v1/', require('./controller/postController'));
app.get("/", (req, res) => {
    try {
        res.send(`<h1>Backend api server is working.<h1>`);
    }
    catch (err) {
        res.send(`Server is not respond ${err.message}.`);
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    // if (err) throw new Error("server connection time error.");
    // else 
    console.log(`Backend server is running on ${port}.`);
    connectDB();
});
