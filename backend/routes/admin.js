const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
    getUsers,
    addOfficer,
    toggleUserStatus,
    editUser,
    getDepartments,
    addDepartment,
    updateDepartment,
    getAllComplaints,
    assignComplaint,
    getAllFeedback,
    getReports
} = require('../controllers/adminController');

router.use(verifyToken, isAdmin);

// User Management
router.get('/users', getUsers);
router.post('/users/officer', addOfficer);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id', editUser);

// Department Management
router.get('/departments', getDepartments);
router.post('/departments', addDepartment);
router.put('/departments/:id', updateDepartment);

// Complaint Management
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/assign', assignComplaint);

// Feedback & Reports
router.get('/feedback', getAllFeedback);
router.get('/reports', getReports);

module.exports = router;
