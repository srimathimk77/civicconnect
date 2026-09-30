const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'civicconnect_secret_key_12345';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const isCitizen = (req, res, next) => {
    if (req.user && req.user.role === 'CITIZEN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Citizen role required.' });
    }
};

const isOfficer = (req, res, next) => {
    if (req.user && req.user.role === 'OFFICER') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Officer role required.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = {
    verifyToken,
    isCitizen,
    isOfficer,
    isAdmin,
    JWT_SECRET
};
