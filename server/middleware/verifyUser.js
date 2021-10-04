const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    //Get the token from the header
    const token = req.header("x-auth-token");

    //Check if token
    if (!token) return res.status(401).json({ message: 'No token, Authorization is denied' });

    //verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'token is not valid.' });
    }
}