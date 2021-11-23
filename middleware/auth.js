const jwt = require('jsonwebtoken');

// Function to verify token provided by user before accessing resources
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token){
        return res.status(401).json({
            "message": "A token is required for authentication"
        });
    }        
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decodedToken;
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({
            "message": "Invalid authentication token"
        });
    }
    return next();
}

module.exports = verifyToken;