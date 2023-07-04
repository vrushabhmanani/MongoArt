import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();
const userModel = require('../model/userModel');
const { authenticate } = require('../controller/middleware');

router.get('/', async (req, res) => {
    try {
        res.json({ 'res': '0', 'msg': "Welcome to users controller." })
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message })
    }
});

router.post('/registor', async (req, res) => {
    try {
        let { email, name, password } = req.body;
        if (!email) {
            throw new Error("Please provide email address.");
        } else if (!name) {
            throw new Error("Please provide name.");
        } else if (!password) {
            throw new Error("Please provide password.");
        } else {
            email = email.toLowerCase();
            const userIsExites = await userModel.findOne({ email });
            if (userIsExites) {
                res.json({ 'res': '0', 'msg': 'User email address all ready exits.' })
            } else {
                // const salt: any = process.env.SALT;
                password = await bcrypt.hash(password, 16);
                await userModel.create({
                    email: email,
                    name: name,
                    password: password,
                    role: 'User',
                })
                res.json({ 'res': '0', 'msg': 'User added sucessfully.' });
            }
        }
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) {
            throw new Error("Please provide email address.");
        } else if (!password) {
            throw new Error("Please provide password.");
        } else {
            email = email.toLowerCase();
            let userIsExites: any = await userModel.findOne({ email });
            if (!userIsExites) {
                res.json({ 'res': '0', 'msg': 'User email address not exits.' })
            } else {
                userIsExites = JSON.parse(JSON.stringify(userIsExites));
                password = bcrypt.compare(password, userIsExites.password);
                if (!password) {
                    res.json({ 'res': '0', 'msg': 'User password is not vaild.' });
                } else {
                    let payload = {
                        _id: userIsExites._id,
                        role: userIsExites.role,
                    }
                    const token = jwt.sign(payload, "jwt_secret");
                    userIsExites['token'] = token;
                    res.json({ 'res': '0', 'msg': 'User added sucessfully.', 'data': userIsExites });
                }
            }
        }
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message })
    }
});

router.get('/AllUsers', authenticate, async (req, res) => {
    try {
        let userIsExites = (req.body.login_user_role == "Admin") ? await userModel.find({ _id: { $nin: [req.body.login_user_id] } }) : await userModel.find();
        res.json({ 'res': '0', 'msg': 'Success.', 'data': userIsExites })
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message })
    }
});

module.exports = router;

