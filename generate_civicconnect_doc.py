import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def add_table_borders(table, border_hex="CBD5E1"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="{border_hex}"/>'
        f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="{border_hex}"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_hex}"/>'
        f'  <w:insideV w:val="none"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_civicconnect_document(output_paths, image_dir):
    doc = docx.Document()

    # Configure Margins: 1 inch all around (A4 format)
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)

    # Base font style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==========================================
    # 0. HEADER LINE (Matching Reference Document)
    # ==========================================
    p_hdr = doc.add_paragraph()
    p_hdr.paragraph_format.space_before = Pt(0)
    p_hdr.paragraph_format.space_after = Pt(14)
    r_date = p_hdr.add_run("29.09.26\t\t\tPARTIAL IMPLEMENTATION")
    r_date.bold = True
    r_date.font.size = Pt(12)
    r_date.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    # ==========================================
    # 1. AIM
    # ==========================================
    p_aim_lbl = doc.add_paragraph()
    p_aim_lbl.paragraph_format.space_before = Pt(8)
    p_aim_lbl.paragraph_format.space_after = Pt(4)
    r_aim_lbl = p_aim_lbl.add_run("AIM:")
    r_aim_lbl.bold = True
    r_aim_lbl.font.size = Pt(12)
    r_aim_lbl.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    p_aim = doc.add_paragraph()
    p_aim.paragraph_format.space_after = Pt(14)
    p_aim.paragraph_format.line_spacing = 1.15
    r_aim_text = p_aim.add_run(
        "To design, develop, and partially implement \"CivicConnect\" - a web-based civic complaint management, "
        "public service delivery, and departmental resolution tracking platform. The system empowers citizens to "
        "report municipal grievances (such as road damage, sanitation lapses, water leakages, and broken streetlights) "
        "directly to municipal authorities with photo evidence, provides real-time lifecycle tracking across transparent "
        "stages (Submitted -> Assigned -> In Progress -> Resolved/Rejected), facilitates automated department allocation "
        "and field officer resolution dispatch, supports citizen satisfaction feedback ratings, and equips municipal "
        "administrators with operational monitoring dashboards and analytical reports."
    )
    r_aim_text.font.size = Pt(11)

    # ==========================================
    # 2. PROJECT DETAIL
    # ==========================================
    p_proj = doc.add_paragraph()
    p_proj.paragraph_format.space_before = Pt(8)
    p_proj.paragraph_format.space_after = Pt(4)
    r_proj = p_proj.add_run("PROJECT DETAIL:")
    r_proj.bold = True
    r_proj.font.size = Pt(12)
    r_proj.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    p_sub_proj = doc.add_paragraph()
    p_sub_proj.paragraph_format.space_after = Pt(6)
    r_sub_proj = p_sub_proj.add_run("Project Details")
    r_sub_proj.bold = True
    r_sub_proj.font.size = Pt(11)
    r_sub_proj.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    # Table 1: Item & Details
    table1 = doc.add_table(rows=1, cols=2)
    table1.alignment = WD_TABLE_ALIGNMENT.CENTER
    table1.autofit = False

    hdr_cells = table1.rows[0].cells
    hdr_cells[0].text = "Item"
    hdr_cells[1].text = "Details"
    for c in hdr_cells:
        set_cell_background(c, "1E293B")
        set_cell_margins(c, 110, 110, 150, 150)
        p = c.paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.size = Pt(10.5)

    data1 = [
        ("Project Title", "CivicConnect - Civic Complaint Management & Public Service Platform"),
        ("Technology Stack", "HTML5, CSS3, JavaScript (ES6+), React 18, Vite, Node.js, Express.js, MySQL, SQLite, JWT, Multer"),
        ("Frontend Server", "Vite Development Server (Port 3000 / 3001)"),
        ("Backend Server", "Node.js Express REST API (Port 5000)"),
        ("Database", "MySQL 8.0 (Primary) with Zero-Config Embedded SQLite Fallback (civicconnect.db)"),
        ("Development Environment", "Visual Studio Code, Node.js (v20+), Windows 11"),
        ("Architecture", "Three-Tier Web-based Client-Server Architecture with Decoupled REST APIs"),
        ("Authentication", "Role-Based Access Control (RBAC) and JWT Session Management with bcryptjs"),
        ("Main Users", "Citizen, Government Department Officer, Municipal Administrator, Public Guest")
    ]

    for item, detail in data1:
        row = table1.add_row()
        c0, c1 = row.cells
        c0.text = item
        c1.text = detail
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(10)
        c0.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        c1.paragraphs[0].runs[0].font.size = Pt(10)
        c1.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 85, 85, 140, 140)
        set_cell_margins(c1, 85, 85, 140, 140)

    table1.columns[0].width = Inches(2.2)
    table1.columns[1].width = Inches(4.07)
    add_table_borders(table1)

    # Space between tables
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(8)
    p_spacer.paragraph_format.space_after = Pt(2)

    # Table 2: Technology Stack and Architecture
    p_arch_tbl = doc.add_paragraph()
    p_arch_tbl.paragraph_format.space_before = Pt(4)
    p_arch_tbl.paragraph_format.space_after = Pt(6)
    r_arch_tbl = p_arch_tbl.add_run("Technology Stack and Architecture:")
    r_arch_tbl.bold = True
    r_arch_tbl.font.size = Pt(11.5)
    r_arch_tbl.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    table2 = doc.add_table(rows=1, cols=2)
    table2.alignment = WD_TABLE_ALIGNMENT.CENTER
    table2.autofit = False

    hdr_cells2 = table2.rows[0].cells
    hdr_cells2[0].text = "Layer"
    hdr_cells2[1].text = "Technology / Purpose"
    for c in hdr_cells2:
        set_cell_background(c, "1E293B")
        set_cell_margins(c, 110, 110, 150, 150)
        p = c.paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.size = Pt(10.5)

    data2 = [
        ("Frontend", "React 18 Single Page Application (SPA), HTML5, JavaScript (ES6+), Vite Dev Server"),
        ("UI Design", "Custom CSS3 with responsive dashboards, status badges, and Lucide React icons"),
        ("State & Navigation", "React Router v6 for Protected Role Routes; React Context API (AuthContext)"),
        ("Backend", "Node.js with Express.js Modular RESTful Architecture"),
        ("Database Connectivity", "Promisified sqlite3 query adapter & mysql2 connection pool"),
        ("Database", "MySQL 8.0 (6 normalized relational tables) with fallback to embedded SQLite (civicconnect.db)"),
        ("File Upload Handling", "Multer middleware for multipart/form-data complaint photo uploads and validation"),
        ("Authentication", "JSON Web Tokens (JWT) in Authorization Bearer headers, bcryptjs (10 salt rounds)"),
        ("Notification Dispatcher", "Automated in-app notification alerts on complaint submission, assignment, and status updates"),
        ("Architecture", "Three-Tier Client-Server Web Architecture with Decoupled RESTful APIs")
    ]

    for layer, tech in data2:
        row = table2.add_row()
        c0, c1 = row.cells
        c0.text = layer
        c1.text = tech
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(10)
        c0.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        c1.paragraphs[0].runs[0].font.size = Pt(10)
        c1.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 85, 85, 140, 140)
        set_cell_margins(c1, 85, 85, 140, 140)

    table2.columns[0].width = Inches(2.2)
    table2.columns[1].width = Inches(4.07)
    add_table_borders(table2)

    # ==========================================
    # 3. CODE SNIPPETS
    # ==========================================
    doc.add_page_break()
    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(8)
    p_code.paragraph_format.space_after = Pt(8)
    r_code = p_code.add_run("CODE SNIPPETS:")
    r_code.bold = True
    r_code.font.size = Pt(13)
    r_code.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    snippets = [
        (
            "1. ROLE-BASED AUTHENTICATION & JWT VERIFICATION MIDDLEWARE:",
            """// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'civicconnect_secret_key_12345';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, role, department_id }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const isCitizen = (req, res, next) => {
    if (req.user && req.user.role === 'CITIZEN') next();
    else res.status(403).json({ message: 'Access denied. Citizen role required.' });
};

const isOfficer = (req, res, next) => {
    if (req.user && req.user.role === 'OFFICER') next();
    else res.status(403).json({ message: 'Access denied. Officer role required.' });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') next();
    else res.status(403).json({ message: 'Access denied. Admin role required.' });
};

module.exports = { verifyToken, isCitizen, isOfficer, isAdmin, JWT_SECRET };"""
        ),
        (
            "2. RELATIONAL DATABASE CONNECTION & PROMISIFIED QUERY ADAPTER:",
            """// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../civicconnect.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error connecting to SQLite database:', err.message);
    else console.log('Connected to CivicConnect SQLite database at:', dbPath);
});

// Promisified helper methods for async/await execution
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

module.exports = { db, query, get, run };"""
        ),
        (
            "3. CITIZEN GRIEVANCE SUBMISSION & AUDIT TRAIL LOGGING:",
            """// backend/controllers/citizenController.js
// Citizen lodges a new civic complaint with photo evidence
const submitComplaint = async (req, res) => {
    try {
        const { title, description, category, location, priority } = req.body;
        const citizenId = req.user.id;

        if (!title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please fill all required complaint fields.' });
        }

        // Generate unique complaint tracking ID (e.g., CC + random 4-digit code)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const complaintId = `CC${randomNum}`;
        const complaintDate = new Date().toISOString().split('T')[0];
        const selectedPriority = priority || 'Medium';
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Insert Complaint Record
        await run(
            `INSERT INTO complaints (complaint_id, citizen_id, title, description, category, location, complaint_date, priority, status, image_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)`,
            [complaintId, citizenId, title, description, category, location, complaintDate, selectedPriority, imagePath]
        );

        // Record Initial State in Status History Audit Trail
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks)
             VALUES (?, 'None', 'Submitted', ?, 'Complaint submitted by citizen.')`,
            [complaintId, citizenId]
        );

        // Trigger Notification for Citizen
        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read)
             VALUES (?, ?, ?, 0)`,
            [citizenId, complaintId, `Your complaint ${complaintId} has been successfully submitted.`]
        );

        return res.status(201).json({ message: 'Complaint submitted successfully!', complaintId });
    } catch (err) {
        return res.status(500).json({ message: 'Error submitting complaint.' });
    }
};"""
        ),
        (
            "4. GOVERNMENT OFFICER STATUS UPDATE & RESOLUTION LIFECYCLE:",
            """// backend/controllers/officerController.js
// Field Officer updates complaint progress and logs resolution notes
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks, resolution_description } = req.body;
        const officerId = req.user.id;

        const validStatuses = ['Assigned', 'In Progress', 'Resolved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const complaint = await get(`SELECT * FROM complaints WHERE complaint_id = ?`, [id]);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

        const oldStatus = complaint.status;
        const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19);

        if (status === 'Resolved') {
            if (!resolution_description || resolution_description.trim() === '') {
                return res.status(400).json({ message: 'Resolution description is required for Resolved status.' });
            }
            await run(
                `UPDATE complaints 
                 SET status = ?, resolution_description = ?, resolution_date = ?, officer_id = ?, updated_at = ? 
                 WHERE complaint_id = ?`,
                [status, resolution_description, nowFormatted, officerId, nowFormatted, id]
            );
        } else {
            await run(
                `UPDATE complaints SET status = ?, officer_id = ?, updated_at = ? WHERE complaint_id = ?`,
                [status, officerId, nowFormatted, id]
            );
        }

        // Log Lifecycle Audit Trail
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks) 
             VALUES (?, ?, ?, ?, ?)`,
            [id, oldStatus, status, officerId, remarks || `Status changed from ${oldStatus} to ${status}`]
        );

        // Notify Citizen on Status Transition
        const notificationMsg = status === 'Resolved' ? `Complaint ${id} has been resolved.` : `Complaint ${id} is now ${status}.`;
        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read) VALUES (?, ?, ?, 0)`,
            [complaint.citizen_id, id, notificationMsg]
        );

        return res.status(200).json({ message: `Complaint status updated to ${status} successfully.` });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating complaint status.' });
    }
};"""
        ),
        (
            "5. MUNICIPAL ADMIN DEPARTMENT ALLOCATION & ANALYTICS REPORTING:",
            """// backend/controllers/adminController.js
// Admin assigns complaint to department and designated officer
const assignComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_id, officer_id, remarks } = req.body;
        const adminId = req.user.id;

        const complaint = await get('SELECT * FROM complaints WHERE complaint_id = ?', [id]);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

        const oldStatus = complaint.status;
        const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19);

        await run(
            `UPDATE complaints 
             SET department_id = ?, officer_id = ?, status = 'Assigned', updated_at = ? 
             WHERE complaint_id = ?`,
            [department_id, officer_id || null, nowFormatted, id]
        );

        // Log Status History
        await run(
            `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, updated_by, remarks)
             VALUES (?, ?, 'Assigned', ?, ?)`,
            [id, oldStatus, adminId, remarks || 'Assigned to department by Admin.']
        );

        // Fetch department name for notification
        const dept = await get('SELECT department_name FROM departments WHERE department_id = ?', [department_id]);
        const deptName = dept ? dept.department_name : 'relevant department';

        await run(
            `INSERT INTO notifications (user_id, complaint_id, message, is_read) VALUES (?, ?, ?, 0)`,
            [complaint.citizen_id, id, `Complaint ${id} has been assigned to ${deptName}.`]
        );

        return res.status(200).json({ message: 'Complaint assigned successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Error assigning complaint.' });
    }
};"""
        )
    ]

    for title, code_text in snippets:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(12)
        p_t.paragraph_format.space_after = Pt(4)
        r_t = p_t.add_run(title)
        r_t.bold = True
        r_t.font.size = Pt(11)
        r_t.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        # Code block container table for shading
        tbl_code = doc.add_table(rows=1, cols=1)
        tbl_code.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl_code.autofit = False
        tbl_code.columns[0].width = Inches(6.27)
        c = tbl_code.rows[0].cells[0]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 80, 80, 120, 120)
        add_table_borders(tbl_code, "94A3B8")

        p_c = c.paragraphs[0]
        p_c.paragraph_format.space_before = Pt(0)
        p_c.paragraph_format.space_after = Pt(0)
        p_c.paragraph_format.line_spacing = 1.05
        r_c = p_c.add_run(code_text)
        r_c.font.name = 'Consolas'
        r_c.font.size = Pt(8.5)
        r_c.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # ==========================================
    # 4. SCREEN SHORTS (Matching Reference Document)
    # ==========================================
    doc.add_page_break()
    p_ss = doc.add_paragraph()
    p_ss.paragraph_format.space_before = Pt(10)
    p_ss.paragraph_format.space_after = Pt(8)
    r_ss = p_ss.add_run("SCREEN SHORTS:")
    r_ss.bold = True
    r_ss.font.size = Pt(13)
    r_ss.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    screenshots_info = [
        (
            "1. HOME AND LANDING PAGE:",
            "civic_landing.png",
            "Public home portal displaying live civic grievance metrics, municipal department overviews, and quick action shortcuts for citizen engagement."
        ),
        (
            "2. END-TO-END:",
            "civic_end_to_end_flow.png",
            "Systematic 6-stage lifecycle illustrating citizen complaint registration, automatic ticket generation, department allocation, officer investigation, resolution, and citizen feedback."
        ),
        (
            "3. LOGIN:",
            "civic_login.png",
            "Secure multi-role authentication portal featuring JWT credential validation and 1-click viva testing demo switchers for Citizen, Officer, and Admin access."
        ),
        (
            "4. ARCHITECTURE:",
            "civic_architecture_diagram.png",
            "Modular three-tier system architecture diagram showing the React SPA presentation layer, Express REST API layer, business logic services, and hybrid MySQL/SQLite database engine."
        ),
        (
            "4. USER LOGIN SCREENSHORTS",
            None,
            None
        ),
        (
            "5.1 CITIZEN DASHBOARD & STATS OVERVIEW:",
            "civic_citizen_dashboard.png",
            "Citizen personal workspace showing grievance summary counters (Total, In Progress, Resolved), quick complaint links, recent activity, and latest notifications."
        ),
        (
            "5.2 GRIEVANCE SUBMISSION WITH EVIDENCE UPLOAD:",
            "civic_submit_complaint.png",
            "Citizen grievance filing interface featuring category selection, priority flags, exact location details, description textarea, and photo evidence upload."
        ),
        (
            "5.3 CITIZEN COMPLAINT TRACKER & STATUS TIMELINE:",
            "civic_my_complaints.png",
            "Complaint tracking roster with unique ticket IDs (CCXXXX), category badges, submission dates, current status tags, and detail view navigation."
        ),
        (
            "5.4 GOVERNMENT OFFICER DASHBOARD & WORKSPACE:",
            "civic_officer_dashboard.png",
            "Officer operational dashboard highlighting pending departmental issues, high-priority grievances, quick status update shortcuts, and department info."
        ),
        (
            "5.5 OFFICER ASSIGNED COMPLAINT RESOLUTION QUEUE:",
            "civic_officer_complaints.png",
            "Departmental grievance queue allowing field officers to filter tickets, review citizen descriptions and photos, update status, and log resolution descriptions."
        ),
        (
            "5.6 MUNICIPAL ADMIN CENTRAL DASHBOARD:",
            "civic_admin_dashboard.png",
            "Administrative command center monitoring platform-wide grievance metrics, registered citizens, active department officers, and feedback ratings."
        ),
        (
            "5.7 MUNICIPAL DEPARTMENT MANAGEMENT:",
            "civic_admin_departments.png",
            "Department administrative management module for creating municipal departments, updating descriptions, and reviewing departmental assigned grievances."
        ),
        (
            "5.8 ADMIN COMPLAINT ALLOCATION & MANAGEMENT:",
            "civic_admin_complaints.png",
            "Central grievance control module enabling administrators to allocate incoming unassigned complaints to specific departments and designated officers."
        ),
        (
            "5.9 OPERATIONAL ANALYTICS & PLATFORM REPORTS:",
            "civic_admin_reports.png",
            "Municipal analytics dashboard displaying visual status breakdowns, department performance metrics, category distribution, and average citizen satisfaction ratings."
        ),
        (
            "5.10 CITIZEN & OFFICER USER DIRECTORY MANAGEMENT:",
            "civic_admin_users.png",
            "User management console providing oversight of registered citizens and department officers with account creation and active/inactive status toggles."
        ),
    ]

    for title, img_filename, caption in screenshots_info:
        p_lbl = doc.add_paragraph()
        p_lbl.paragraph_format.space_before = Pt(14)
        p_lbl.paragraph_format.space_after = Pt(4)
        r_lbl = p_lbl.add_run(title)
        r_lbl.bold = True
        r_lbl.font.size = Pt(11)
        r_lbl.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        if img_filename:
            img_path = os.path.join(image_dir, img_filename)
            if os.path.exists(img_path):
                # Insert Image
                p_img = doc.add_paragraph()
                p_img.paragraph_format.space_before = Pt(2)
                p_img.paragraph_format.space_after = Pt(4)
                p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_img.add_run().add_picture(img_path, width=Inches(6.0))

                # Caption
                p_cap = doc.add_paragraph()
                p_cap.paragraph_format.space_after = Pt(12)
                p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r_cap = p_cap.add_run(f"Figure: {caption}")
                r_cap.font.italic = True
                r_cap.font.size = Pt(9.5)
                r_cap.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    # ==========================================
    # 5. WHAT IS DONE
    # ==========================================
    doc.add_page_break()
    p_done_hdr = doc.add_paragraph()
    p_done_hdr.paragraph_format.space_before = Pt(10)
    p_done_hdr.paragraph_format.space_after = Pt(8)
    r_done_hdr = p_done_hdr.add_run("5. WHAT IS DONE")
    r_done_hdr.bold = True
    r_done_hdr.font.size = Pt(12.5)
    r_done_hdr.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    done_items = [
        "Requirements specification and municipal complaint use-cases: Comprehensive software requirement specification (SRS), system architecture, and entity relationship diagrams.",
        "Relational database design: Normalized database schema comprising 6 core tables (departments, users, complaints, complaint_status_history, notifications, feedback) with foreign keys and cascade integrity.",
        "Zero-configuration dual database support: Primary MySQL engine with seamless SQLite embedded fallback (civicconnect.db) for instant portability and viva demonstration.",
        "Role-Based Access Control (RBAC): Four distinct personas implemented - Citizen, Government Department Officer, Municipal Administrator, and Public Guest.",
        "Security & Session management: JWT (JSON Web Tokens) with bcryptjs password encryption (10 salt rounds) and role authorization middlewares (isCitizen, isOfficer, isAdmin).",
        "Citizen registration & profile management: Citizen sign-up, password modification, profile details, and contact number management.",
        "Grievance submission module: Form validation for title, category, priority, location, detailed description, and evidence photo upload via Multer.",
        "Automated Complaint Ticketing: Unique CCXXXX tracking ticket generation for indexing and fast public reference.",
        "Multi-stage complaint lifecycle: Sequential state transitions (Submitted -> Assigned -> In Progress -> Resolved / Rejected).",
        "Audit trail status logging: Dedicated history table recording every status update, timestamps, remarks, and user IDs.",
        "Government officer dashboard: Department-level complaint queue, priority badges, and status filtering.",
        "Field officer resolution workflow: Work status updates (In Progress, Resolved, Rejected) with mandatory resolution notes.",
        "Municipal administrator control center: Platform monitoring, new department officer account creation, and user active/inactive toggles.",
        "Department management: Creation, updating, and oversight of municipal departments (Roads, Sanitation, Water, Electricity).",
        "Complaint assignment system: Administrative tools to allocate grievances to relevant departments and designated officers.",
        "Citizen feedback & rating system: 1 to 5 star rating submission and satisfaction review on resolved complaints.",
        "In-app notification system: Automated real-time alerts dispatched on complaint submission, department assignment, and status transitions.",
        "Operational analytics & reporting: Visual breakdown and summary statistics of complaints by status, category, department, and citizen ratings.",
        "Modern frontend UI: Responsive Single Page Application (SPA) built with React 18 (Vite), Vanilla CSS3, custom cards, and Lucide React icons."
    ]

    for item in done_items:
        p_d = doc.add_paragraph(style='List Bullet')
        p_d.paragraph_format.space_before = Pt(2)
        p_d.paragraph_format.space_after = Pt(4)
        p_d.paragraph_format.line_spacing = 1.15
        r_d = p_d.add_run(item)
        r_d.font.size = Pt(10.5)

    # ==========================================
    # 6. WHAT NEEDS TO BE DONE
    # ==========================================
    p_todo_hdr = doc.add_paragraph()
    p_todo_hdr.paragraph_format.space_before = Pt(14)
    p_todo_hdr.paragraph_format.space_after = Pt(8)
    r_todo_hdr = p_todo_hdr.add_run("6. WHAT NEEDS TO BE DONE")
    r_todo_hdr.bold = True
    r_todo_hdr.font.size = Pt(12.5)
    r_todo_hdr.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    todo_items = [
        "Interactive GIS Map Integration: Visual geospatial mapping of civic complaints using Leaflet / Google Maps API to display heatmaps and location clusters.",
        "AI-Powered Duplicate Complaint Detection: Computer vision and NLP text similarity matching to cluster identical grievances submitted from the same vicinity.",
        "Automated Department Routing: Machine learning text classification to automatically categorize and route complaints to the appropriate department.",
        "External SMS & WhatsApp Notifications: Integration with Twilio / WhatsApp Business API for instant external SMS alerts to citizens on status milestones.",
        "Citizen Geolocation Auto-Detection: Browser HTML5 GPS geolocation auto-fill during grievance submission for accurate location tagging.",
        "PDF Resolution Certificate & Work Order: Generating printable municipal work orders and completion reports with official digital stamps.",
        "Public Transparency Leaderboard: City-wide ward rankings, departmental resolution SLAs, and public performance scorecards.",
        "Offline-First Mobile Application: Progressive Web App (PWA) / React Native mobile app with offline photo caching for citizens in low-connectivity areas.",
        "IoT Smart Sensor Integration: Automated ticket creation triggered by smart waste bin fullness sensors and water pipe flow meters.",
        "Production Cloud Deployment & CI/CD: Containerization with Docker, managed MySQL on AWS RDS, and automated CI/CD pipeline on AWS / Render.",
        "Security Audits & Load Testing: OWASP Top 10 security hardening, CSRF protection, and high-concurrency stress testing."
    ]

    for item in todo_items:
        p_t = doc.add_paragraph(style='List Bullet')
        p_t.paragraph_format.space_before = Pt(2)
        p_t.paragraph_format.space_after = Pt(4)
        p_t.paragraph_format.line_spacing = 1.15
        r_t = p_t.add_run(item)
        r_t.font.size = Pt(10.5)

    # Save to all requested destinations
    for path in output_paths:
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        doc.save(path)
        print(f"Successfully saved Word document to: {path}")

if __name__ == '__main__':
    img_dir = r"C:\Users\Kowshik\Desktop\civicconnect\image"

    destinations = [
        r"C:\Users\Kowshik\Desktop\civicconnect partial implementation.docx",
        r"C:\Users\Kowshik\Desktop\civicconnect\civicconnect partial implementation.docx"
    ]

    build_civicconnect_document(destinations, img_dir)
