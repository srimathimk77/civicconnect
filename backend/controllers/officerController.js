const { get, query, run } = require('../config/db');

// Officer Profile
const getProfile = async (req, res) => {
    try {
        const officer = await get(
            `SELECT u.user_id, u.name, u.email, u.phone, u.role, u.department_id, d.department_name, d.description as department_description
             FROM users u
             LEFT JOIN departments d ON u.department_id = d.department_id
             WHERE u.user_id = ?`,
            [req.user.id]
        );
        if (!officer) {
            return res.status(404).json({ message: 'Officer profile not found.' });
        }
        return res.status(200).json(officer);
    } catch (err) {
        console.error('Officer Profile Error:', err);
        return res.status(500).json({ message: 'Error fetching officer profile.' });
    }
};

// Get Assigned Complaints for Officer's Department
const getAssignedComplaints = async (req, res) => {
    try {
        const departmentId = req.user.department_id;
        const { status, search } = req.query;

        let sql = `
            SELECT c.*, citizen.name as citizen_name, citizen.phone as citizen_phone, citizen.email as citizen_email
            FROM complaints c
            JOIN users citizen ON c.citizen_id = citizen.user_id
            WHERE c.department_id = ?
        `;
        const params = [departmentId];

        if (status && status.trim() !== '') {
            sql += ` AND c.status = ?`;
            params.push(status);
        }

        if (search && search.trim() !== '') {
            sql += ` AND (c.complaint_id LIKE ? OR c.title LIKE ? OR c.location LIKE ?)`;
            const searchPattern = `%${search.trim()}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        sql += ` ORDER BY c.created_at DESC`;

        const complaints = await query(sql, params);
        return res.status(200).json(complaints);
    } catch (err) {
        console.error('Get Assigned Complaints Error:', err);
        return res.status(500).json({ message: 'Error fetching assigned complaints.' });
    }
};

// Get Complaint Details for Officer
const getComplaintDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await get(
            `SELECT c.*, d.department_name, citizen.name as citizen_name, citizen.email as citizen_email, citizen.phone as citizen_phone, citizen.address as citizen_address
             FROM complaints c
             LEFT JOIN departments d ON c.department_id = d.department_id
             JOIN users citizen ON c.citizen_id = citizen.user_id
             WHERE c.complaint_id = ?`,
            [id]
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        // Fetch status history
        const history = await query(
            `SELECT h.*, u.name as updated_by_name, u.role as updated_by_role
             FROM complaint_status_history h
             JOIN users u ON h.updated_by = u.user_id
             WHERE h.complaint_id = ?
             ORDER BY h.updated_at ASC`,
            [id]
        );

        return res.status(200).json({ complaint, history });
    } catch (err) {
        console.error('Get Officer Complaint Details Error:', err);
        return res.status(500).json({ message: 'Error fetching complaint details.' });
    }
};

// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks, resolution_description } = req.body;
        const officerId = req.user.id;

        const validStatuses = ['Assigned', 'In Progress', 'Resolved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value. Must be Assigned, In Progress, Resolved, or Rejected.' });
        }

        const complaint = await get(`SELECT * FROM complaints WHERE complaint_id = ?`, [id]);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        const oldStatus = complaint.status;
        const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19);

        if (status === 'Resolved') {
            if (!resolution_description || resolution_description.trim() === '') {
                return res.status(400).json({ message: 'Resolution description is required when marking a complaint as Resolved.' });
            }
            await run(
                `UPDATE complaints 
                 SET status = ?, resolution_description = ?, resolution_date = ?, officer_id = ?, updated_at = ? 
                 WHERE complaint_id = ?`,
                [status, resolution_description, nowFormatted, officerId, nowFormatted, id]
            );
        } else {
            await run(
                `UPDATE complaints 
                 SET status = ?, officer_id = ?, updated_at = ? 
                 WHERE complaint_id = ?`,
                [status, officerId, nowFormatted, id]
            );
        }

        // Log status change history
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks) 
             VALUES (?, ?, ?, ?, ?)`,
            [id, oldStatus, status, officerId, remarks || `Status changed from ${oldStatus} to ${status}`]
        );

        // Notify Citizen
        let notificationMsg = `Complaint ${id} is now ${status}.`;
        if (status === 'Resolved') {
            notificationMsg = `Complaint ${id} has been resolved.`;
        } else if (status === 'Rejected') {
            notificationMsg = `Complaint ${id} has been rejected.`;
        }

        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read) 
             VALUES (?, ?, ?, 0)`,
            [complaint.citizen_id, id, notificationMsg]
        );

        return res.status(200).json({ message: `Complaint status updated to ${status} successfully.` });
    } catch (err) {
        console.error('Update Complaint Status Error:', err);
        return res.status(500).json({ message: 'Error updating complaint status.' });
    }
};

module.exports = {
    getProfile,
    getAssignedComplaints,
    getComplaintDetails,
    updateComplaintStatus
};
