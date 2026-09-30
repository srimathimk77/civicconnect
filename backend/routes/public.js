const express = require('express');
const router = express.Router();
const { get, query } = require('../config/db');

// GET /api/public/stats - Public information about civic complaints platform
router.get('/stats', async (req, res) => {
    try {
        const totalComplaints = await get(`SELECT COUNT(*) as count FROM complaints`);
        const resolvedComplaints = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'`);
        const totalDepartments = await get(`SELECT COUNT(*) as count FROM departments`);
        const activeCitizens = await get(`SELECT COUNT(*) as count FROM users WHERE role = 'CITIZEN'`);

        const recentResolved = await query(
            `SELECT c.complaint_id, c.title, c.category, c.location, c.complaint_date, d.department_name
             FROM complaints c
             LEFT JOIN departments d ON c.department_id = d.department_id
             WHERE c.status = 'Resolved'
             ORDER BY c.resolution_date DESC LIMIT 5`
        );

        return res.status(200).json({
            stats: {
                totalComplaints: totalComplaints.count,
                resolvedComplaints: resolvedComplaints.count,
                totalDepartments: totalDepartments.count,
                activeCitizens: activeCitizens.count
            },
            recentResolved
        });
    } catch (err) {
        console.error('Public Stats Error:', err);
        return res.status(500).json({ message: 'Error loading public platform statistics.' });
    }
});

// GET /api/public/departments - List departments publicly
router.get('/departments', async (req, res) => {
    try {
        const departments = await query('SELECT department_id, department_name, description FROM departments ORDER BY department_name ASC');
        return res.status(200).json(departments);
    } catch (err) {
        console.error('Public Departments Error:', err);
        return res.status(500).json({ message: 'Error loading departments.' });
    }
});

module.exports = router;
