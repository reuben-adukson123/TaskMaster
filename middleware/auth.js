const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Middleware to ensure the user is authenticated
const ensureAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }
};

module.exports = { ensureAuth };
