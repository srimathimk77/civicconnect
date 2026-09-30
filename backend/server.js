const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const citizenRoutes = require('./routes/citizen');
const officerRoutes = require('./routes/officer');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/citizens', citizenRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Direct aliases matching requirements API specs
app.use('/api/complaints', citizenRoutes);
app.use('/api/feedback', citizenRoutes);
app.use('/api/notifications', citizenRoutes);

// Root health check
app.get('/', (req, res) => {
    res.json({ message: 'CivicConnect Backend API is up and running!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`CivicConnect Backend Server running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
