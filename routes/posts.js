const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

// Create new Post
router.post('/', async (req, res) => {
    if (!req.body.userId) {
        res.status(400).json({ "message": "Provide the userId of the author" });
        return;
    }
    const author = await User.findById(req.body.userId);
    if (!author) {
        res.status(400).json({
            "message": "Error provide a valid author userId",
        });
        return;
    }
    try {
        const newPost = new Post(req.body);
        let savedPost = await newPost.save()
        const response = {
            ...savedPost._doc,
            "author": {
                "userId": author._id,
                "username": author.username,
                "profile": author.profilePic,
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
            res.status(404).json({
                "message": "Post not found",
            });
            return;
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
        res.status(200).json({
            "message": "Post details fetched successfully",
            "post": response
        });
        return;


    } catch (error) {
        res.status(500).json({
            "message": "error when fetching post",
            "error": error.message
        });
    }

});

// Update Post
router.put('/:id', async (req, res) => {
    if (!req.body.userId) {
        res.status(400).json({
            "message": "You must provide author's userId"
        });
        return;
    }
    try {
        const postFound = await Post.findById(req.params.id);
        if (!postFound) {
            res.status(404).json({
                "message": "Post does not exist"
            });
            return;
        }
        if (postFound.userId !== req.body.userId) {
            res.status(401).json({
                "message": "You can only edit your own posts"
            });
            return;
        }

        const { userId, ...others } = req.body
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: others,
        }, {
            new: true
        });
        const author = await User.findById(postFound.userId);
        const response = {
            ...updatedPost._doc,
            "author": {
                "userId": author._id,
                "username": author.username,
                "profile": author.profilePic,
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
router.delete('/:id', async (req, res) => {
    if (!req.body.userId) {
        res.status(400).json({
            "message": "You must provide author's userId"
        });
        return;
    }

    try {
        const postFound = await Post.findById(req.params.id);
        if (!postFound) {
            res.status(404).json({
                "message": "Post does not exist"
            });
            return;
        }
        if (postFound.userId !== req.body.userId) {
            res.status(401).json({
                "message": "You can only edit your own posts"
            });
            return;
        }

        const deletedPost = await postFound.delete();
        res.status(200).json({
            "message": "User successfully deleted",
            "post": {
                "postId": deletedPost._id,
                "title": deletedPost.title
            }
        });

    } catch (error) {
        res.status(500).json({
            "message": "error when deleting post",
            "error": error.message
        });
    }
});

module.exports = router;