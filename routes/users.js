const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// Get user
router.get('/:id', auth, async (req, res) => {
    try {
        const userFound = await User.findById(req.params.id);
        if (!userFound) {
            res.status(404).json({
                "message": "User not found",
            });
            return;
        }
        const { password, ...others } = userFound._doc
        res.status(200).json({
            "message": "User details fetched successfully",
            "user": others
        });

    } catch (error) {
        res.status(500).json({
            "message": "error when fetching user account",
            "error": error.message
        });
    }

});



// Update user
router.put('/:id', auth, async (req, res) => {
    if (req.user.user_id === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true
            });
            const { password, ...others } = updatedUser._doc
            res.status(200).json({
                "message": "User updated successfully",
                "user": others,
            });
        } catch (error) {
            res.status(500).json({
                "message": "error when updating user account",
                "error": error.message
            });
        }
    } else {
        res.status(401).json({
            "message": "You can only update your user account",
        });
    }

});

// Delete User
router.delete('/:id', auth, async (req, res) => {
    if (req.user.user_id === req.params.id) {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                res.status(404).json({
                    "message": "User not found",
                });
                return;
            }
            await Post.deleteMany({ username: user.username });
            const deletedUser = await User.findByIdAndDelete(req.body.userId);
            res.status(200).json({
                "message": "User successfully deleted",
                "user": {
                    "userId": deletedUser._id,
                    "username": deletedUser.username
                }
            });

        } catch (error) {
            res.status(500).json({
                "message": "error when deleting user account",
                "error": error.message
            });
        }
    } else {
        res.status(401).json({
            "message": "You can only delete your user account",
        });
    }

});

module.exports = router;