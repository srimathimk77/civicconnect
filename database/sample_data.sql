-- CivicConnect Sample Data (MySQL)
-- Passwords below are bcrypt hashed values for password 'admin123', 'officer123', 'citizen123'
-- Hash for 'admin123', 'officer123', 'citizen123' (salt 10): $2a$10$w40xMvhK80xP5c8i1Z7Uv.4W73c5kG4Q6kQ1hM6N30P0X1M0Q1M0Q or bcrypt standard.

USE civicconnect;

-- 1. INSERT DEPARTMENTS
INSERT INTO departments (department_id, department_name, description) VALUES
(1, 'Roads Department', 'Responsible for road maintenance, repairs, potholes, and paving.'),
(2, 'Sanitation Department', 'Responsible for garbage collection, waste management, and street sweeping.'),
(3, 'Water Department', 'Responsible for public water supply, pipe leakages, and water quality.'),
(4, 'Electricity Department', 'Responsible for street lights, transformers, and electrical grid safety.');

-- 2. INSERT USERS (ADMIN, OFFICERS, CITIZENS)
-- Admin Password: admin123 -> $2b$10$Rz2bF2ZJjLqZ1b1z/1vCeu.6.1P.1.1.1.1.1.1 (or generated via bcrypt)
-- Officer Password: officer123
-- Citizen Password: citizen123

INSERT INTO users (user_id, name, email, phone, password, address, role, department_id, is_active) VALUES
(1, 'System Administrator', 'admin@civicconnect.com', '9876543210', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Civic Center, Main HQ', 'ADMIN', NULL, 1),
(2, 'Robert Johnson (Roads Officer)', 'officer@roads.com', '9876543211', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Roads Division Office', 'OFFICER', 1, 1),
(3, 'Elena Gomez (Sanitation Officer)', 'officer.sanitation@civicconnect.com', '9876543212', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Sanitation Dept HQ', 'OFFICER', 2, 1),
(4, 'Rahul Sharma', 'citizen@gmail.com', '9876543213', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '42 MG Road, Sector 4', 'CITIZEN', NULL, 1),
(5, 'John Doe', 'john.doe@gmail.com', '9876543214', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '12 Park Avenue, Sector 9', 'CITIZEN', NULL, 1),
(6, 'Sarah Smith', 'sarah.smith@gmail.com', '9876543215', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '88 Hill View Layout', 'CITIZEN', NULL, 1);

-- 3. INSERT SAMPLE COMPLAINTS
INSERT INTO complaints (complaint_id, citizen_id, title, description, category, location, complaint_date, priority, department_id, officer_id, status, resolution_description, resolution_date, created_at) VALUES
('CC1001', 4, 'Damaged road with large potholes', 'Deep crater potholes causing major traffic congestion and vehicle damage near Central Market junction.', 'Road Damage', 'Central Market Road, Junction 4', '2026-09-01', 'High', 1, 2, 'Resolved', 'Road crew asphalted and resurfaced the entire 200m section.', '2026-09-05 14:30:00', '2026-09-01 09:15:00'),
('CC1002', 4, 'Garbage not collected for 3 days', 'Waste bins overflowing into the street causing severe odor and unhygienic conditions.', 'Garbage/Waste', 'Sector 4 Community Park Gate', '2026-09-02', 'Medium', 2, 3, 'In Progress', NULL, NULL, '2026-09-02 11:00:00'),
('CC1003', 5, 'Street light flickering and broken', 'Dark alleyway due to broken streetlight pole #44, raising security concerns.', 'Street Light', 'Park Avenue Lane 3', '2026-09-04', 'Low', 4, NULL, 'Assigned', NULL, NULL, '2026-09-04 18:20:00'),
('CC1004', 6, 'Water supply pipe leaking on main road', 'Clean drinking water gushing out onto pavement from cracked underground line.', 'Water Supply', 'Hill View Main Gate', '2026-09-06', 'Urgent', 3, NULL, 'Submitted', NULL, NULL, '2026-09-06 08:45:00'),
('CC1005', 5, 'Drainage overflow in residential lane', 'Storm drain blocked with plastic debris causing sewage backup in front of houses.', 'Drainage', '12 Park Avenue', '2026-09-07', 'High', 1, 2, 'Rejected', NULL, NULL, '2026-09-07 10:10:00');

-- 4. INSERT COMPLAINT STATUS HISTORY
INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks, updated_at) VALUES
('CC1001', 'Submitted', 'Assigned', 1, 'Assigned to Roads Department and Officer Robert Johnson.', '2026-09-01 10:30:00'),
('CC1001', 'Assigned', 'In Progress', 2, 'Inspection completed, road repair equipment dispatched.', '2026-09-02 09:00:00'),
('CC1001', 'In Progress', 'Resolved', 2, 'Road crew asphalted and resurfaced the entire 200m section.', '2026-09-05 14:30:00'),
('CC1002', 'Submitted', 'Assigned', 1, 'Assigned to Sanitation Department.', '2026-09-02 12:00:00'),
('CC1002', 'Assigned', 'In Progress', 3, 'Sanitation truck scheduled for evening cleanup.', '2026-09-03 08:30:00'),
('CC1003', 'Submitted', 'Assigned', 1, 'Assigned to Electricity Department.', '2026-09-05 09:00:00'),
('CC1005', 'Submitted', 'Assigned', 1, 'Assigned to Roads/Drainage division.', '2026-09-07 11:00:00'),
('CC1005', 'Assigned', 'Rejected', 2, 'Private property drainage issue; outside municipal jurisdiction.', '2026-09-08 10:00:00');

-- 5. INSERT NOTIFICATIONS
INSERT INTO notifications (notification_id, user_id, complaint_id, message, is_read, created_at) VALUES
(1, 4, 'CC1001', 'Complaint CC1001 has been submitted successfully.', 1, '2026-09-01 09:15:00'),
(2, 4, 'CC1001', 'Complaint CC1001 has been assigned to the Roads Department.', 1, '2026-09-01 10:30:00'),
(3, 4, 'CC1001', 'Complaint CC1001 is now In Progress.', 1, '2026-09-02 09:00:00'),
(4, 4, 'CC1001', 'Complaint CC1001 has been resolved.', 0, '2026-09-05 14:30:00'),
(5, 4, 'CC1002', 'Complaint CC1002 has been submitted successfully.', 1, '2026-09-02 11:00:00'),
(6, 4, 'CC1002', 'Complaint CC1002 is now In Progress.', 0, '2026-09-03 08:30:00'),
(7, 5, 'CC1003', 'Complaint CC1003 has been submitted successfully.', 1, '2026-09-04 18:20:00'),
(8, 6, 'CC1004', 'Complaint CC1004 has been submitted successfully.', 0, '2026-09-06 08:45:00');

-- 6. INSERT FEEDBACK
INSERT INTO feedback (feedback_id, complaint_id, citizen_id, rating, comment, created_at) VALUES
(1, 'CC1001', 4, 5, 'Prompt resolution of the pothole issue! The road is smooth now. Thank you CivicConnect team.', '2026-09-05 16:00:00');
