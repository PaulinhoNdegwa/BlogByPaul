const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { getUserResponse } = require('../utils/utils');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body
        if(!(email && password && username)){
            return res.status(400).json({
                "message": "Email, password and username fields are required"
            });
        }
        const oldUser = await User.findOne({$or:[{  email }, { username }], function (err, user){
            if(err){
                console.log("Error finding existing user: " )
                console.log(err)
            } 
        }
        });
        if(oldUser){
            return res.status(400).json({
                "message": "Email and/or username already exists"
            });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const user = await newUser.save();
        const response = getUserResponse(user);
        res.status(200).json({
            "message": "user successfully created",
            "user": response
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
        const response = getUserResponse(user._doc);
        res.status(200).json({
            "message": "login successful",
            "user": response
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "message": "error when logging in",
            "error": error.message
        });
    }
})

module.exports = router;