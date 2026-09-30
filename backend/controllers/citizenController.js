const { get, query, run } = require('../config/db');
const bcrypt = require('bcryptjs');

// Get Profile
const getProfile = async (req, res) => {
    try {
        const user = await get('SELECT user_id, name, email, phone, address, role, created_at FROM users WHERE user_id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error('Get Profile Error:', err);
        return res.status(500).json({ message: 'Error retrieving profile.' });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, newPassword } = req.body;
        const userId = req.user.id;

        if (!name || !phone || !address) {
            return res.status(400).json({ message: 'Name, phone, and address are required.' });
        }

        if (newPassword && newPassword.trim() !== '') {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters.' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await run('UPDATE users SET name = ?, phone = ?, address = ?, password = ? WHERE user_id = ?', [
                name, phone, address, hashedPassword, userId
            ]);
        } else {
            await run('UPDATE users SET name = ?, phone = ?, address = ? WHERE user_id = ?', [
                name, phone, address, userId
            ]);
        }

        const updatedUser = await get('SELECT user_id, name, email, phone, address, role FROM users WHERE user_id = ?', [userId]);

        return res.status(200).json({
            message: 'Profile updated successfully!',
            user: updatedUser
        });
    } catch (err) {
        console.error('Update Profile Error:', err);
        return res.status(500).json({ message: 'Error updating profile.' });
    }
};

// Submit Complaint
const submitComplaint = async (req, res) => {
    try {
        const { title, description, category, location, priority } = req.body;
        const citizenId = req.user.id;

        if (!title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please fill all required complaint fields.' });
        }

        // Generate Complaint ID (e.g., CC + random 4 digit number)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const complaintId = `CC${randomNum}`;

        const complaintDate = new Date().toISOString().split('T')[0];
        const selectedPriority = priority || 'Medium';
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Insert Complaint
        await run(
            `INSERT INTO complaints (complaint_id, citizen_id, title, description, category, location, complaint_date, priority, status, image_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)`,
            [complaintId, citizenId, title, description, category, location, complaintDate, selectedPriority, imagePath]
        );

        // Insert Status History
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks)
             VALUES (?, 'None', 'Submitted', ?, 'Complaint submitted by citizen.')`,
            [complaintId, citizenId]
        );

        // Insert Notification
        const notificationMsg = `Complaint ${complaintId} has been submitted successfully.`;
        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read)
             VALUES (?, ?, ?, 0)`,
            [citizenId, complaintId, notificationMsg]
        );

        return res.status(201).json({
            message: 'Complaint submitted successfully!',
            complaint_id: complaintId
        });
    } catch (err) {
        console.error('Submit Complaint Error:', err);
        return res.status(500).json({ message: 'Error submitting complaint.' });
    }
};

// Get My Complaints
const getMyComplaints = async (req, res) => {
    try {
        const citizenId = req.user.id;
        const complaints = await query(
            `SELECT c.*, d.department_name 
             FROM complaints c
             LEFT JOIN departments d ON c.department_id = d.department_id
             WHERE c.citizen_id = ?
             ORDER BY c.created_at DESC`,
            [citizenId]
        );
        return res.status(200).json(complaints);
    } catch (err) {
        console.error('Get My Complaints Error:', err);
        return res.status(500).json({ message: 'Error fetching complaints.' });
    }
};

// Get Complaint Details
const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await get(
            `SELECT c.*, d.department_name, u.name as officer_name, u.phone as officer_phone, u.email as officer_email, citizen.name as citizen_name, citizen.email as citizen_email, citizen.phone as citizen_phone
             FROM complaints c
             LEFT JOIN departments d ON c.department_id = d.department_id
             LEFT JOIN users u ON c.officer_id = u.user_id
             LEFT JOIN users citizen ON c.citizen_id = citizen.user_id
             WHERE c.complaint_id = ?`,
            [id]
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        // Fetch History
        const history = await query(
            `SELECT h.*, u.name as updated_by_name, u.role as updated_by_role
             FROM complaint_status_history h
             JOIN users u ON h.updated_by = u.user_id
             WHERE h.complaint_id = ?
             ORDER BY h.updated_at ASC`,
            [id]
        );

        // Fetch Feedback if exists
        const fb = await get(
            `SELECT * FROM feedback WHERE complaint_id = ?`,
            [id]
        );

        return res.status(200).json({
            complaint,
            history,
            feedback: fb || null
        });
    } catch (err) {
        console.error('Get Complaint Details Error:', err);
        return res.status(500).json({ message: 'Error fetching complaint details.' });
    }
};

// Notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await query(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );
        return res.status(200).json(notifications);
    } catch (err) {
        console.error('Get Notifications Error:', err);
        return res.status(500).json({ message: 'Error fetching notifications.' });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await run(`UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?`, [id, req.user.id]);
        return res.status(200).json({ message: 'Notification marked as read.' });
    } catch (err) {
        console.error('Mark Notification Error:', err);
        return res.status(500).json({ message: 'Error updating notification.' });
    }
};

// Submit Feedback
const submitFeedback = async (req, res) => {
    try {
        const { complaint_id, rating, comment } = req.body;
        const citizenId = req.user.id;

        if (!complaint_id || !rating) {
            return res.status(400).json({ message: 'Complaint ID and Rating are required.' });
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
        }

        // Verify complaint exists and is resolved
        const complaint = await get(`SELECT * FROM complaints WHERE complaint_id = ?`, [complaint_id]);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        if (complaint.citizen_id !== citizenId) {
            return res.status(403).json({ message: 'You can only provide feedback for your own complaints.' });
        }

        if (complaint.status !== 'Resolved') {
            return res.status(400).json({ message: 'Feedback can be submitted only after the complaint is resolved.' });
        }

        // Check duplicate feedback
        const existingFeedback = await get(`SELECT feedback_id FROM feedback WHERE complaint_id = ?`, [complaint_id]);
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback has already been submitted for this complaint.' });
        }

        // Insert feedback
        await run(
            `INSERT INTO feedback (complaint_id, citizen_id, rating, comment) VALUES (?, ?, ?, ?)`,
            [complaint_id, citizenId, ratingNum, comment || '']
        );

        return res.status(201).json({ message: 'Thank you for your feedback!' });
    } catch (err) {
        console.error('Submit Feedback Error:', err);
        return res.status(500).json({ message: 'Error submitting feedback.' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    submitComplaint,
    getMyComplaints,
    getComplaintById,
    getNotifications,
    markNotificationRead,
    submitFeedback
};
