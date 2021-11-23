const jwt = require('jsonwebtoken');

const getUserResponse = (user) => {
    const token = jwt.sign({
        user_id: user._id,
        email: user.email,
    },
        process.env.TOKEN_KEY,
        {
            expiresIn: '30 days'
        }
    );
    const response = {
        "_id": user._id,
        "username": user.username,
        "email": user.email,
        "token": token,
        "profilePic": user.profilePic,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt,
    }
    return response;
}

module.exports = { getUserResponse };