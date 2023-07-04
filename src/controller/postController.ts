import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();
const postModel = require('../model/postModel');
const { authenticate } = require('../controller/middleware');

router.post('/addPost', authenticate, async (req, res) => {
    try {
        const { postname, isActive, userId } = req.body;
        if (!postname) {
            throw new Error("Please provide post name.");
        } else if (!userId) {
            throw new Error("Please provide user id.");
        } else {
            const postData = await postModel.create({
                postname: postname,
                isActive: (isActive) ? isActive : false,
                userId: userId
            })
            if (postData) {
                res.json({ 'res': '0', 'msg': 'Post is added sucessfully.', 'data': postData });
            } else {
                res.json({ 'res': '0', 'msg': 'Please try again.' });
            }
        }
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message });
    }
});

router.put('/:postId/updatePost', authenticate, async (req, res) => {
    try {
        if (!req.params.postId) {
            throw new Error("Please provide post details.");
        } else {
            let updateQuery: any = {}, updatedPostDetails;
            if (req.body.postname) {
                updateQuery.postname = req.body.postname;
            }
            if (req.body.isActive) {
                updateQuery.isActive = req.body.isActive;
            }
            if (req.body.login_user_role == "Admin") {
                updatedPostDetails = await postModel.findByIdAndUpdate(req.params.postId, updateQuery, { new: true });
                res.json({ 'res': '0', 'msg': 'Your post updated.', 'data': updatedPostDetails });
            } else {
                const postDetails = await postModel.findOne({ _id: req.params.postId, userId: req.body.userId });
                if (postDetails) {
                    updatedPostDetails = await postModel.findByIdAndUpdate(req.params.postId, updateQuery, { new: true });
                    if (updatedPostDetails) {
                        res.json({ 'res': '0', 'msg': 'Your post updated.', 'data': updatedPostDetails });
                    } else {
                        res.json({ 'res': '1', 'msg': 'Please try again.' });
                    }
                } else {
                    res.json({ 'res': '1', 'msg': 'Your record is not found in our system.' });
                }
            }
        }
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message });
    }
});

router.delete('/:postId/deletePost', authenticate, async (req, res) => {
    try {
        if (!req.params.postId) {
            throw new Error("Please provide post details.");
        } else {
            if (req.body.login_user_role == "Admin") {
                const postData = await postModel.findByIdAndDelete(req.params.postId);
                (postData != null) ? res.json({ 'res': '0', 'msg': 'Your post deleted.' }) : res.json({ 'res': '1', 'msg': 'Please provide details.' });
            } else {
                const postData = await postModel.findByIdAndDelete({ _id: req.params.postId, userId: req.body.userId });
                (postData != null) ? res.json({ 'res': '0', 'msg': 'Your post deleted.' }) : res.json({ 'res': '1', 'msg': 'Please provide details.' });
            }
        }
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message });
    }
});

router.get('/allPost', authenticate, async (req, res) => {
    try {
        let { pageNumber, PageRecord, search } = req.body;
        pageNumber = (pageNumber) ? pageNumber : 1;
        PageRecord = (PageRecord) ? PageRecord : 2;
        search = new RegExp(search, 'i');
        let userIsExites = await postModel.find({
            userId: { $in: [req.body.login_user_id] },
            $or: [{ postname: search }]
        }).populate("userId","_id email name").limit(PageRecord).skip((pageNumber - 1) * PageRecord).sort(req.query.sort);
        let postCount = await postModel.count({
            userId: { $in: [req.body.login_user_id] }, $or: [{ postname: search }]
        })
        res.json({ 'res': '0', 'msg': 'Success.', 'count': postCount, 'data': userIsExites })
    } catch (err: any) {
        res.json({ 'res': '1', 'msg': err.message })
    }
});

module.exports = router;