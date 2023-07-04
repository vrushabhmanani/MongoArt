"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const userModel = require('../model/userModel');
const { authenticate } = require('../controller/middleware');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ 'res': '0', 'msg': "Welcome to users controller." });
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.post('/registor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name, password } = req.body;
        if (!email) {
            throw new Error("Please provide email address.");
        }
        else if (!name) {
            throw new Error("Please provide name.");
        }
        else if (!password) {
            throw new Error("Please provide password.");
        }
        else {
            email = email.toLowerCase();
            const userIsExites = yield userModel.findOne({ email });
            if (userIsExites) {
                res.json({ 'res': '0', 'msg': 'User email address all ready exits.' });
            }
            else {
                // const salt: any = process.env.SALT;
                password = yield bcryptjs_1.default.hash(password, 16);
                yield userModel.create({
                    email: email,
                    name: name,
                    password: password,
                    role: 'User',
                });
                res.json({ 'res': '0', 'msg': 'User added sucessfully.' });
            }
        }
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        if (!email) {
            throw new Error("Please provide email address.");
        }
        else if (!password) {
            throw new Error("Please provide password.");
        }
        else {
            email = email.toLowerCase();
            let userIsExites = yield userModel.findOne({ email });
            if (!userIsExites) {
                res.json({ 'res': '0', 'msg': 'User email address not exits.' });
            }
            else {
                userIsExites = JSON.parse(JSON.stringify(userIsExites));
                password = bcryptjs_1.default.compare(password, userIsExites.password);
                if (!password) {
                    res.json({ 'res': '0', 'msg': 'User password is not vaild.' });
                }
                else {
                    let payload = {
                        _id: userIsExites._id,
                        role: userIsExites.role,
                    };
                    const token = jsonwebtoken_1.default.sign(payload, "jwt_secret");
                    userIsExites['token'] = token;
                    res.json({ 'res': '0', 'msg': 'User added sucessfully.', 'data': userIsExites });
                }
            }
        }
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.get('/AllUsers', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userIsExites = (req.body.login_user_role == "Admin") ? yield userModel.find({ _id: { $nin: [req.body.login_user_id] } }) : yield userModel.find();
        res.json({ 'res': '0', 'msg': 'Success.', 'data': userIsExites });
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
module.exports = router;
