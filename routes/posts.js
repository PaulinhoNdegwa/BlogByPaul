const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Create new Post
router.post('/', auth, async (req, res) => {
    
    const author = await User.findById(req.user.user_id);
    if (!author) {
        return res.status(400).json({
            "message": "Author account does not exist",
        });
    }
    req.body.userId = author._id;
    try {
        const newPost = new Post(req.body);
        let savedPost = await newPost.save()
        const response = {
            ...savedPost._doc,
            "author": {
                "userId": author._id,
                "username": author.username,
                "profilePic": author.profilePic,
            }
        }
        res.status(201).json({
            "message": "Post created successfully",
            "post": response
        })
    } catch (error) {
        res.status(500).json({
            "message": "Error creating new post",
            "error": error.message
        });
    }
});

// Get Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json({
            "message": "Posts fetched successfully",
            "posts": posts
        })
    } catch (error) {
        res.status(500).json({
            "message": "error when fetching posts",
            "error": error.message
        });
    }
})

// Get Post
router.get('/:id', async (req, res) => {
    try {
        const postFound = await Post.findById(req.params.id);
        if (!postFound) {
            return res.status(404).json({
                "message": "Post not found",
            });
        }
        const author = await User.findById(postFound.userId);
        const response = {
            ...postFound._doc,
            "author": {
                "userId": author._id || '',
                "username": author.username || '',
                "profile": author.profilePic || '',
            }
        }
        return res.status(200).json({
            "message": "Post details fetched successfully",
            "post": response
        });


    } catch (error) {
        res.status(500).json({
            "message": "error when fetching post",
            "error": error.message
        });
    }

});

// Update Post
router.put('/:id', auth, async (req, res) => {
    try {
        const postFound = await Post.findById(req.params.id);
        if (!postFound) {
            return res.status(404).json({
                "message": "Post does not exist"
            });
        }
        if (postFound.userId !== req.user.user_id) {
            return res.status(401).json({
                "message": "You can only edit your own posts"
            });
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {
            new: true
        });
        const response = {
            ...updatedPost._doc,
            "author": {
                "userId": req.user.user_id,
                "email": req.user.email,
                "username": req.user.username,
            }
        }
        res.status(200).json({
            "message": "Post updated successfully",
            "post": response,
        });
    } catch (error) {
        res.status(500).json({
            "message": "error when updating post",
            "error": error.message
        });
    }

});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
    try {
        const postFound = await Post.findById(req.params.id);
        if (!postFound) {
            return res.status(404).json({
                "message": "Post does not exist"
            });
        }
        if (postFound.userId !== req.user.user_id) {
            return res.status(401).json({
                "message": "You can only delete your own posts"
            });
        }

        const deletedPost = await postFound.delete();
        return res.status(200).json({
            "message": "User successfully deleted",
            "post": {
                "postId": deletedPost._id,
                "title": deletedPost.title
            }
        });

    } catch (error) {
        return res.status(500).json({
            "message": "error when deleting post",
            "error": error.message
        });
    }
});

module.exports = router;