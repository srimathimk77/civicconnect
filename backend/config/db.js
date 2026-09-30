const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../civicconnect.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to CivicConnect SQLite database at:', dbPath);
    }
});

// Promisified helper methods for clean async/await usage
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

// Initialize schema and sample seed data automatically
const initDb = async () => {
    try {
        await run(`PRAGMA foreign_keys = ON;`);

        // 1. Departments Table
        await run(`
            CREATE TABLE IF NOT EXISTS departments (
                department_id INTEGER PRIMARY KEY AUTOINCREMENT,
                department_name TEXT NOT NULL UNIQUE,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Users Table
        await run(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT NOT NULL,
                password TEXT NOT NULL,
                address TEXT,
                role TEXT CHECK(role IN ('CITIZEN', 'OFFICER', 'ADMIN')) NOT NULL DEFAULT 'CITIZEN',
                department_id INTEGER NULL,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
            );
        `);

        // 3. Complaints Table
        await run(`
            CREATE TABLE IF NOT EXISTS complaints (
                complaint_id TEXT PRIMARY KEY,
                citizen_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                complaint_date DATE NOT NULL,
                priority TEXT DEFAULT 'Medium',
                department_id INTEGER NULL,
                officer_id INTEGER NULL,
                status TEXT CHECK(status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected')) DEFAULT 'Submitted',
                resolution_description TEXT NULL,
                resolution_date DATETIME NULL,
                image_path TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (citizen_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
                FOREIGN KEY (officer_id) REFERENCES users(user_id) ON DELETE SET NULL
            );
        `);

        // 4. Complaint Status History Table
        await run(`
            CREATE TABLE IF NOT EXISTS complaint_status_history (
                history_id INTEGER PRIMARY KEY AUTOINCREMENT,
                complaint_id TEXT NOT NULL,
                old_status TEXT NOT NULL,
                new_status TEXT NOT NULL,
                updated_by INTEGER NOT NULL,
                remarks TEXT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
                FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `);

        // 5. Notifications Table
        await run(`
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                complaint_id TEXT NOT NULL,
                message TEXT NOT NULL,
                is_read INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
            );
        `);

        // 6. Feedback Table
        await run(`
            CREATE TABLE IF NOT EXISTS feedback (
                feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
                complaint_id TEXT NOT NULL UNIQUE,
                citizen_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
                FOREIGN KEY (citizen_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `);

        // Check if sample users exist
        const existingUsers = await get(`SELECT COUNT(*) as count FROM users`);
        if (existingUsers.count === 0) {
            console.log('Seeding initial sample data for CivicConnect...');

            // Seed Departments
            await run(`INSERT INTO departments (department_id, department_name, description) VALUES
                (1, 'Roads Department', 'Responsible for road maintenance, repairs, potholes, and paving.'),
                (2, 'Sanitation Department', 'Responsible for garbage collection, waste management, and street sweeping.'),
                (3, 'Water Department', 'Responsible for public water supply, pipe leakages, and water quality.'),
                (4, 'Electricity Department', 'Responsible for street lights, transformers, and electrical grid safety.');
            `);

            // Seed Passwords (hashed)
            const adminPass = await bcrypt.hash('admin123', 10);
            const officerPass = await bcrypt.hash('officer123', 10);
            const citizenPass = await bcrypt.hash('citizen123', 10);

            // Seed Users
            await run(`INSERT INTO users (user_id, name, email, phone, password, address, role, department_id, is_active) VALUES
                (1, 'System Administrator', 'admin@civicconnect.com', '9876543210', '${adminPass}', 'Civic Center, Main HQ', 'ADMIN', NULL, 1),
                (2, 'Robert Johnson (Roads Officer)', 'officer@roads.com', '9876543211', '${officerPass}', 'Roads Division Office', 'OFFICER', 1, 1),
                (3, 'Elena Gomez (Sanitation Officer)', 'officer.sanitation@civicconnect.com', '9876543212', '${officerPass}', 'Sanitation Dept HQ', 'OFFICER', 2, 1),
                (4, 'Rahul Sharma', 'citizen@gmail.com', '9876543213', '${citizenPass}', '42 MG Road, Sector 4', 'CITIZEN', NULL, 1),
                (5, 'John Doe', 'john.doe@gmail.com', '9876543214', '${citizenPass}', '12 Park Avenue, Sector 9', 'CITIZEN', NULL, 1),
                (6, 'Sarah Smith', 'sarah.smith@gmail.com', '9876543215', '${citizenPass}', '88 Hill View Layout', 'CITIZEN', NULL, 1);
            `);

            // Seed Complaints
            await run(`INSERT INTO complaints (complaint_id, citizen_id, title, description, category, location, complaint_date, priority, department_id, officer_id, status, resolution_description, resolution_date, created_at) VALUES
                ('CC1001', 4, 'Damaged road with large potholes', 'Deep crater potholes causing major traffic congestion and vehicle damage near Central Market junction.', 'Road Damage', 'Central Market Road, Junction 4', '2026-09-01', 'High', 1, 2, 'Resolved', 'Road crew asphalted and resurfaced the entire 200m section.', '2026-09-05 14:30:00', '2026-09-01 09:15:00'),
                ('CC1002', 4, 'Garbage not collected for 3 days', 'Waste bins overflowing into the street causing severe odor and unhygienic conditions.', 'Garbage/Waste', 'Sector 4 Community Park Gate', '2026-09-02', 'Medium', 2, 3, 'In Progress', NULL, NULL, '2026-09-02 11:00:00'),
                ('CC1003', 5, 'Street light flickering and broken', 'Dark alleyway due to broken streetlight pole #44, raising security concerns.', 'Street Light', 'Park Avenue Lane 3', '2026-09-04', 'Low', 4, NULL, 'Assigned', NULL, NULL, '2026-09-04 18:20:00'),
                ('CC1004', 6, 'Water supply pipe leaking on main road', 'Clean drinking water gushing out onto pavement from cracked underground line.', 'Water Supply', 'Hill View Main Gate', '2026-09-06', 'Urgent', 3, NULL, 'Submitted', NULL, NULL, '2026-09-06 08:45:00'),
                ('CC1005', 5, 'Drainage overflow in residential lane', 'Storm drain blocked with plastic debris causing sewage backup in front of houses.', 'Drainage', '12 Park Avenue', '2026-09-07', 'High', 1, 2, 'Rejected', NULL, NULL, '2026-09-07 10:10:00');
            `);

            // Seed Complaint History
            await run(`INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks, updated_at) VALUES
                ('CC1001', 'Submitted', 'Assigned', 1, 'Assigned to Roads Department and Officer Robert Johnson.', '2026-09-01 10:30:00'),
                ('CC1001', 'Assigned', 'In Progress', 2, 'Inspection completed, road repair equipment dispatched.', '2026-09-02 09:00:00'),
                ('CC1001', 'In Progress', 'Resolved', 2, 'Road crew asphalted and resurfaced the entire 200m section.', '2026-09-05 14:30:00'),
                ('CC1002', 'Submitted', 'Assigned', 1, 'Assigned to Sanitation Department.', '2026-09-02 12:00:00'),
                ('CC1002', 'Assigned', 'In Progress', 3, 'Sanitation truck scheduled for evening cleanup.', '2026-09-03 08:30:00'),
                ('CC1003', 'Submitted', 'Assigned', 1, 'Assigned to Electricity Department.', '2026-09-05 09:00:00'),
                ('CC1005', 'Submitted', 'Assigned', 1, 'Assigned to Roads/Drainage division.', '2026-09-07 11:00:00'),
                ('CC1005', 'Assigned', 'Rejected', 2, 'Private property drainage issue; outside municipal jurisdiction.', '2026-09-08 10:00:00');
            `);

            // Seed Notifications
            await run(`INSERT INTO notifications (notification_id, user_id, complaint_id, message, is_read, created_at) VALUES
                (1, 4, 'CC1001', 'Complaint CC1001 has been submitted successfully.', 1, '2026-09-01 09:15:00'),
                (2, 4, 'CC1001', 'Complaint CC1001 has been assigned to the Roads Department.', 1, '2026-09-01 10:30:00'),
                (3, 4, 'CC1001', 'Complaint CC1001 is now In Progress.', 1, '2026-09-02 09:00:00'),
                (4, 4, 'CC1001', 'Complaint CC1001 has been resolved.', 0, '2026-09-05 14:30:00'),
                (5, 4, 'CC1002', 'Complaint CC1002 has been submitted successfully.', 1, '2026-09-02 11:00:00'),
                (6, 4, 'CC1002', 'Complaint CC1002 is now In Progress.', 0, '2026-09-03 08:30:00'),
                (7, 5, 'CC1003', 'Complaint CC1003 has been submitted successfully.', 1, '2026-09-04 18:20:00'),
                (8, 6, 'CC1004', 'Complaint CC1004 has been submitted successfully.', 0, '2026-09-06 08:45:00');
            `);

            // Seed Feedback
            await run(`INSERT INTO feedback (feedback_id, complaint_id, citizen_id, rating, comment, created_at) VALUES
                (1, 'CC1001', 4, 5, 'Prompt resolution of the pothole issue! The road is smooth now. Thank you CivicConnect team.', '2026-09-05 16:00:00');
            `);

            console.log('Sample data seeding complete!');
        }
    } catch (err) {
        console.error('Error initializing database tables/seed data:', err.message);
    }
};

initDb();

module.exports = {
    db,
    query,
    get,
    run
};
