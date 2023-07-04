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
const router = express_1.default.Router();
const postModel = require('../model/postModel');
const { authenticate } = require('../controller/middleware');
router.post('/addPost', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postname, isActive, userId } = req.body;
        if (!postname) {
            throw new Error("Please provide post name.");
        }
        else if (!userId) {
            throw new Error("Please provide user id.");
        }
        else {
            const postData = yield postModel.create({
                postname: postname,
                isActive: (isActive) ? isActive : false,
                userId: userId
            });
            if (postData) {
                res.json({ 'res': '0', 'msg': 'Post is added sucessfully.', 'data': postData });
            }
            else {
                res.json({ 'res': '0', 'msg': 'Please try again.' });
            }
        }
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.put('/:postId/updatePost', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.postId) {
            throw new Error("Please provide post details.");
        }
        else {
            let updateQuery = {}, updatedPostDetails;
            if (req.body.postname) {
                updateQuery.postname = req.body.postname;
            }
            if (req.body.isActive) {
                updateQuery.isActive = req.body.isActive;
            }
            if (req.body.login_user_role == "Admin") {
                updatedPostDetails = yield postModel.findByIdAndUpdate(req.params.postId, updateQuery, { new: true });
                res.json({ 'res': '0', 'msg': 'Your post updated.', 'data': updatedPostDetails });
            }
            else {
                const postDetails = yield postModel.findOne({ _id: req.params.postId, userId: req.body.userId });
                if (postDetails) {
                    updatedPostDetails = yield postModel.findByIdAndUpdate(req.params.postId, updateQuery, { new: true });
                    if (updatedPostDetails) {
                        res.json({ 'res': '0', 'msg': 'Your post updated.', 'data': updatedPostDetails });
                    }
                    else {
                        res.json({ 'res': '1', 'msg': 'Please try again.' });
                    }
                }
                else {
                    res.json({ 'res': '1', 'msg': 'Your record is not found in our system.' });
                }
            }
        }
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.delete('/:postId/deletePost', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.postId) {
            throw new Error("Please provide post details.");
        }
        else {
            if (req.body.login_user_role == "Admin") {
                const postData = yield postModel.findByIdAndDelete(req.params.postId);
                (postData != null) ? res.json({ 'res': '0', 'msg': 'Your post deleted.' }) : res.json({ 'res': '1', 'msg': 'Please provide details.' });
            }
            else {
                const postData = yield postModel.findByIdAndDelete({ _id: req.params.postId, userId: req.body.userId });
                (postData != null) ? res.json({ 'res': '0', 'msg': 'Your post deleted.' }) : res.json({ 'res': '1', 'msg': 'Please provide details.' });
            }
        }
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
router.get('/allPost', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pageNumber, PageRecord, search } = req.body;
        pageNumber = (pageNumber) ? pageNumber : 1;
        PageRecord = (PageRecord) ? PageRecord : 2;
        search = new RegExp(search, 'i');
        let userIsExites = yield postModel.find({
            userId: { $in: [req.body.login_user_id] },
            $or: [{ postname: search }]
        }).populate("userId","_id email name").limit(PageRecord).skip((pageNumber - 1) * PageRecord).sort(req.query.sort);
        let postCount = yield postModel.count({
            userId: { $in: [req.body.login_user_id] }, $or: [{ postname: search }]
        }).populate("userId");
        res.json({ 'res': '0', 'msg': 'Success.', 'count': postCount, 'data': userIsExites });
    }
    catch (err) {
        res.json({ 'res': '1', 'msg': err.message });
    }
}));
module.exports = router;
