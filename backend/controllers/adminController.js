const { get, query, run } = require('../config/db');
const bcrypt = require('bcryptjs');

// --- USER MANAGEMENT ---
const getUsers = async (req, res) => {
    try {
        const users = await query(
            `SELECT u.user_id, u.name, u.email, u.phone, u.address, u.role, u.department_id, u.is_active, u.created_at, d.department_name
             FROM users u
             LEFT JOIN departments d ON u.department_id = d.department_id
             ORDER BY u.created_at DESC`
        );
        return res.status(200).json(users);
    } catch (err) {
        console.error('Get Users Error:', err);
        return res.status(500).json({ message: 'Error fetching users.' });
    }
};

const addOfficer = async (req, res) => {
    try {
        const { name, email, phone, password, department_id, address } = req.body;

        if (!name || !email || !phone || !password || !department_id) {
            return res.status(400).json({ message: 'Name, email, phone, password, and department are required.' });
        }

        const existing = await get('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await run(
            `INSERT INTO users (name, email, phone, password, address, role, department_id, is_active)
             VALUES (?, ?, ?, ?, ?, 'OFFICER', ?, 1)`,
            [name, email, phone, hashedPassword, address || 'Department Office', department_id]
        );

        return res.status(201).json({ message: 'Department Officer created successfully!' });
    } catch (err) {
        console.error('Add Officer Error:', err);
        return res.status(500).json({ message: 'Error creating officer account.' });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await get('SELECT user_id, is_active, role FROM users WHERE user_id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'ADMIN') {
            return res.status(400).json({ message: 'System Admin account status cannot be toggled.' });
        }

        const newStatus = user.is_active === 1 ? 0 : 1;
        await run('UPDATE users SET is_active = ? WHERE user_id = ?', [newStatus, id]);

        return res.status(200).json({
            message: `User account has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`
        });
    } catch (err) {
        console.error('Toggle User Status Error:', err);
        return res.status(500).json({ message: 'Error toggling user status.' });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, department_id } = req.body;

        await run(
            `UPDATE users SET name = ?, phone = ?, address = ?, department_id = ? WHERE user_id = ?`,
            [name, phone, address, department_id || null, id]
        );

        return res.status(200).json({ message: 'User information updated successfully.' });
    } catch (err) {
        console.error('Edit User Error:', err);
        return res.status(500).json({ message: 'Error updating user.' });
    }
};

// --- DEPARTMENT MANAGEMENT ---
const getDepartments = async (req, res) => {
    try {
        const departments = await query(
            `SELECT d.*, 
                    (SELECT COUNT(*) FROM users u WHERE u.department_id = d.department_id AND u.role = 'OFFICER') as officer_count,
                    (SELECT COUNT(*) FROM complaints c WHERE c.department_id = d.department_id) as complaint_count
             FROM departments d
             ORDER BY d.department_name ASC`
        );
        return res.status(200).json(departments);
    } catch (err) {
        console.error('Get Departments Error:', err);
        return res.status(500).json({ message: 'Error fetching departments.' });
    }
};

const addDepartment = async (req, res) => {
    try {
        const { department_name, description } = req.body;

        if (!department_name || department_name.trim() === '') {
            return res.status(400).json({ message: 'Department name is required.' });
        }

        const existing = await get('SELECT department_id FROM departments WHERE department_name = ?', [department_name.trim()]);
        if (existing) {
            return res.status(400).json({ message: 'Department name already exists.' });
        }

        await run('INSERT INTO departments (department_name, description) VALUES (?, ?)', [
            department_name.trim(), description || ''
        ]);

        return res.status(201).json({ message: 'Department added successfully!' });
    } catch (err) {
        console.error('Add Department Error:', err);
        return res.status(500).json({ message: 'Error adding department.' });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_name, description } = req.body;

        if (!department_name || department_name.trim() === '') {
            return res.status(400).json({ message: 'Department name is required.' });
        }

        await run('UPDATE departments SET department_name = ?, description = ? WHERE department_id = ?', [
            department_name.trim(), description || '', id
        ]);

        return res.status(200).json({ message: 'Department updated successfully.' });
    } catch (err) {
        console.error('Update Department Error:', err);
        return res.status(500).json({ message: 'Error updating department.' });
    }
};

// --- COMPLAINT MANAGEMENT & ASSIGNMENT ---
const getAllComplaints = async (req, res) => {
    try {
        const { status, category, department_id, search } = req.query;

        let sql = `
            SELECT c.*, d.department_name, citizen.name as citizen_name, citizen.phone as citizen_phone, officer.name as officer_name
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN users citizen ON c.citizen_id = citizen.user_id
            LEFT JOIN users officer ON c.officer_id = officer.user_id
            WHERE 1=1
        `;
        const params = [];

        if (status && status.trim() !== '') {
            sql += ` AND c.status = ?`;
            params.push(status);
        }

        if (category && category.trim() !== '') {
            sql += ` AND c.category = ?`;
            params.push(category);
        }

        if (department_id && department_id.trim() !== '') {
            sql += ` AND c.department_id = ?`;
            params.push(department_id);
        }

        if (search && search.trim() !== '') {
            sql += ` AND (c.complaint_id LIKE ? OR c.title LIKE ? OR c.location LIKE ? OR citizen.name LIKE ?)`;
            const pattern = `%${search.trim()}%`;
            params.push(pattern, pattern, pattern, pattern);
        }

        sql += ` ORDER BY c.created_at DESC`;

        const complaints = await query(sql, params);
        return res.status(200).json(complaints);
    } catch (err) {
        console.error('Get All Complaints Error:', err);
        return res.status(500).json({ message: 'Error fetching all complaints.' });
    }
};

const assignComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_id, officer_id, remarks } = req.body;
        const adminId = req.user.id;

        if (!department_id) {
            return res.status(400).json({ message: 'Please select a department to assign.' });
        }

        const complaint = await get('SELECT * FROM complaints WHERE complaint_id = ?', [id]);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        const department = await get('SELECT department_name FROM departments WHERE department_id = ?', [department_id]);
        if (!department) {
            return res.status(404).json({ message: 'Selected department not found.' });
        }

        const oldStatus = complaint.status;
        const newStatus = 'Assigned';

        await run(
            `UPDATE complaints SET department_id = ?, officer_id = ?, status = ? WHERE complaint_id = ?`,
            [department_id, officer_id || null, newStatus, id]
        );

        // Record history log
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks)
             VALUES (?, ?, ?, ?, ?)`,
            [id, oldStatus, newStatus, adminId, remarks || `Assigned to ${department.department_name}`]
        );

        // Notify Citizen
        const notificationMsg = `Complaint ${id} has been assigned to the ${department.department_name}.`;
        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read) VALUES (?, ?, ?, 0)`,
            [complaint.citizen_id, id, notificationMsg]
        );

        // Notify Assigned Officer if officer_id is provided
        if (officer_id) {
            const officerNotice = `New Complaint ${id} assigned to your department.`;
            await run(
                `INSERT INTO notifications (user_id, complaint_id, message, is_read) VALUES (?, ?, ?, 0)`,
                [officer_id, id, officerNotice]
            );
        }

        return res.status(200).json({ message: `Complaint ${id} successfully assigned to ${department.department_name}.` });
    } catch (err) {
        console.error('Assign Complaint Error:', err);
        return res.status(500).json({ message: 'Error assigning complaint.' });
    }
};

// --- FEEDBACK MONITORING ---
const getAllFeedback = async (req, res) => {
    try {
        const feedbackList = await query(
            `SELECT f.*, c.title as complaint_title, c.category, citizen.name as citizen_name, citizen.email as citizen_email
             FROM feedback f
             JOIN complaints c ON f.complaint_id = c.complaint_id
             JOIN users citizen ON f.citizen_id = citizen.user_id
             ORDER BY f.created_at DESC`
        );
        return res.status(200).json(feedbackList);
    } catch (err) {
        console.error('Get All Feedback Error:', err);
        return res.status(500).json({ message: 'Error fetching feedback list.' });
    }
};

// --- REPORT GENERATION ---
const getReports = async (req, res) => {
    try {
        // Total Users
        const totalCitizens = await get(`SELECT COUNT(*) as count FROM users WHERE role = 'CITIZEN'`);
        const totalOfficers = await get(`SELECT COUNT(*) as count FROM users WHERE role = 'OFFICER'`);
        const totalDepartments = await get(`SELECT COUNT(*) as count FROM departments`);

        // Total Complaints & Status Counts
        const totalComplaints = await get(`SELECT COUNT(*) as count FROM complaints`);
        const submitted = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'Submitted'`);
        const assigned = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'Assigned'`);
        const inProgress = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'In Progress'`);
        const resolved = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'`);
        const rejected = await get(`SELECT COUNT(*) as count FROM complaints WHERE status = 'Rejected'`);

        // Complaints by Category
        const byCategory = await query(
            `SELECT category, COUNT(*) as count FROM complaints GROUP BY category ORDER BY count DESC`
        );

        // Complaints by Department
        const byDepartment = await query(
            `SELECT d.department_name, COUNT(c.complaint_id) as count 
             FROM departments d
             LEFT JOIN complaints c ON d.department_id = c.department_id
             GROUP BY d.department_id, d.department_name
             ORDER BY count DESC`
        );

        // Average Feedback Rating
        const avgFeedback = await get(`SELECT AVG(rating) as avg_rating, COUNT(*) as total_feedback FROM feedback`);

        return res.status(200).json({
            totals: {
                citizens: totalCitizens.count,
                officers: totalOfficers.count,
                departments: totalDepartments.count,
                complaints: totalComplaints.count
            },
            statusBreakdown: {
                Submitted: submitted.count,
                Assigned: assigned.count,
                'In Progress': inProgress.count,
                Resolved: resolved.count,
                Rejected: rejected.count
            },
            categoryBreakdown: byCategory,
            departmentBreakdown: byDepartment,
            feedbackSummary: {
                avgRating: avgFeedback.avg_rating ? parseFloat(avgFeedback.avg_rating).toFixed(1) : 0,
                totalFeedback: avgFeedback.total_feedback
            }
        });
    } catch (err) {
        console.error('Get Reports Error:', err);
        return res.status(500).json({ message: 'Error generating report statistics.' });
    }
};

module.exports = {
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
};
