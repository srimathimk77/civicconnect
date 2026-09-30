const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Citizen Registration
const register = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        // Simple validation
        if (!name || !email || !phone || !password || !address) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Check duplicate email
        const existingUser = await get('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new Citizen
        const result = await run(
            'INSERT INTO users (name, email, phone, password, address, role, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [name, email, phone, hashedPassword, address, 'CITIZEN']
        );

        const newUser = {
            id: result.lastID,
            name,
            email,
            phone,
            role: 'CITIZEN',
            department_id: null
        };

        const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '24h' });

        return res.status(201).json({
            message: 'Registration successful!',
            user: newUser,
            token
        });
    } catch (err) {
        console.error('Registration Error:', err);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Login (Citizen, Officer, Admin)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        // Fetch user by email
        const user = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (user.is_active === 0) {
            return res.status(403).json({ message: 'Your account has been deactivated. Contact Admin.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate Token payload
        const userPayload = {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            department_id: user.department_id
        };

        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                department_id: user.department_id
            },
            token
        });
    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = {
    register,
    login
};
