"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var token = req.headers.authorization ? req.headers.authorization.split(" ") : [];
    if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
        return res.json({ 'res': '1', 'msg': "Token  is required." });
    }
    else {
        jsonwebtoken_1.default.verify(token[1], "jwt_secret", (err, data) => {
            if (err) {
                return res.json({ 'res': '1', 'msg': err });
            }
            else {
                req.body.login_user_id = data._id;
                req.body.login_user_role = data.role;
                return next();
            }
        });
    }
};
module.exports = { authenticate };
