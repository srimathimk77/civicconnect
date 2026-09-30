const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, isCitizen } = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    submitComplaint,
    getMyComplaints,
    getComplaintById,
    getNotifications,
    markNotificationRead,
    submitFeedback
} = require('../controllers/citizenController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'complaint-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All citizen routes require valid token and CITIZEN role
router.use(verifyToken, isCitizen);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Complaints
router.post('/complaints', upload.single('attachment'), submitComplaint);
router.get('/complaints/my', getMyComplaints);
router.get('/complaints/:id', getComplaintById);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

// Feedback
router.post('/feedback', submitFeedback);

module.exports = router;
