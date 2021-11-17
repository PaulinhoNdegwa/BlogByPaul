const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const user = await newUser.save();
        const { password, ...others } = user._doc;
        res.status(200).json({
            "message": "user successfully created",
            "user": others
        });
    } catch (error) {
        res.status(500).json({
            "message": "error when creating user account",
            "error": error.message
        });
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log("User not found")
            res.status(400).json({
                "message": "wrong credentials"
            });
            return;
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) {
            console.log("Wrong password")
            res.status(400).json({
                "message": "wrong credentials"
            });
            return;
        }
        const { password, ...others } = user._doc;

        res.status(200).json({
            "message": "login successful",
            "user": others
        })
    } catch (error) {
        res.status(500).json({
            "message": "error when logging in",
            "error": error.message
        });
    }
})

module.exports = router;