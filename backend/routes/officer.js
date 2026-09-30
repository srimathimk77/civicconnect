const express = require('express');
const router = express.Router();
const { verifyToken, isOfficer } = require('../middleware/auth');
const {
    getProfile,
    getAssignedComplaints,
    getComplaintDetails,
    updateComplaintStatus
} = require('../controllers/officerController');

router.use(verifyToken, isOfficer);

// Officer Profile
router.get('/profile', getProfile);

// Officer Complaints
router.get('/complaints', getAssignedComplaints);
router.get('/complaints/:id', getComplaintDetails);
router.put('/complaints/:id/status', updateComplaintStatus);

module.exports = router;
