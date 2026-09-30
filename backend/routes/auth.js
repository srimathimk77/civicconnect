const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout (Stateless JWT logout confirmation)
router.post('/logout', (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
