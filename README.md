# CivicConnect - Civic Complaint Management Platform

## 1. Project Title
**CivicConnect** - Civic Complaint Management and Public Service Platform

## 2. Project Objective
CivicConnect is a simple, clean, fully functional academic web application designed to allow citizens to report civic complaints directly to municipal government departments, track complaint progress in real-time, receive in-app notifications, and provide satisfaction feedback upon resolution. The system also empowers government officers to manage and resolve complaints assigned to their department and provides administrators with tools to oversee departments, assign issues, manage users, and generate platform reports.

---

## 3. Core Features
- **User Authentication**: Secure JWT-based registration and login with role-based page protection.
- **4 Distinct User Roles**: Citizen, Government Officer, Admin, and Guest.
- **Complaint Submission**: Citizens can submit civic complaints with title, category, location, priority, description, and photo attachments. Unique Complaint IDs (`CCXXXX`) generated automatically.
- **Real-Time Status Tracking**: Step-by-step lifecycle tracker (`Submitted` → `Assigned` → `In Progress` → `Resolved` / `Rejected`).
- **In-App Notifications**: Automated notification alerts when complaints are submitted, assigned, updated, or resolved.
- **Feedback & Rating System**: 1 to 5 star rating and review system for resolved complaints.
- **Department & Officer Management**: Admin tools to create departments, assign officers, and allocate complaints.
- **Analytical Reports**: Simple bar chart visualizations and summary tables of complaints by status, category, department, and citizen feedback rating.

---

## 4. User Types
1. **CITIZEN**: Submits complaints, views complaint history, tracks status, receives notifications, edits profile, and submits 1-5 star feedback.
2. **GOVERNMENT DEPARTMENT OFFICER**: Views complaints assigned to their department, updates work status (`In Progress`, `Resolved`, `Rejected`), and enters resolution notes.
3. **ADMIN**: Controls overall platform, manages citizens and department officers, creates departments, assigns complaints, monitors feedback, and generates reports.
4. **PUBLIC/GUEST USER**: Views public platform statistics, department descriptions, home page, login, and registration pages.

---

## 5. Technology Stack
- **Frontend**: React.js (Vite), HTML5, Vanilla CSS, JavaScript (ES6+), Lucide React Icons.
- **Backend**: Node.js, Express.js, JWT (JSON Web Tokens), Multer (file upload), Bcryptjs (password hashing).
- **Database**: MySQL (relational database schema provided in `database/schema.sql` and `database/sample_data.sql`). Automatically initializes zero-config SQLite database (`civicconnect.db`) out-of-the-box for instant college demonstration.
- **API**: RESTful API architecture.

---

## 6. System Modules
1. Public / Guest Module
2. Authentication Module (Login / Register / Logout)
3. Citizen Module (Dashboard, Submit, Track, Notifications, Feedback, Profile)
4. Government Department Officer Module (Dashboard, Department Profile, Queue, Status Update, Resolution)
5. Admin Module (Dashboard, User Management, Department Management, Complaint Assignment, Feedback Monitoring, Reports)
6. Complaint Management Central Module
7. Notification Module
8. Feedback Module
9. Report Generation Module

---

## 7. Database Setup
The system uses standard relational tables:
1. `users`
2. `departments`
3. `complaints`
4. `complaint_status_history`
5. `notifications`
6. `feedback`

The SQL DDL schema script is located at: `database/schema.sql`  
The sample seed data script is located at: `database/sample_data.sql`

To import into MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

---

## 8. How to Run the Project

### Step 1: Install Dependencies
Open a terminal in the root `civicconnect` directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Start Backend Server
In the `backend` directory:
```bash
npm start
```
The backend server will run on **`http://localhost:5000`**. On first boot, it automatically initializes all database tables and seeds sample data out-of-the-box!

### Step 3: Start Frontend Client
In a new terminal, navigate to `frontend`:
```bash
npm run dev
```
The frontend React app will run on **`http://localhost:3000`**.

---

## 9. Sample Login Credentials (Viva Testing Helper)

| User Role | Email | Password | Role Details |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@civicconnect.com` | `admin123` | Full system control |
| **ROADS OFFICER** | `officer@roads.com` | `officer123` | Roads Department Officer |
| **SANITATION OFFICER** | `officer.sanitation@civicconnect.com` | `officer123` | Sanitation Department Officer |
| **CITIZEN** | `citizen@gmail.com` | `citizen123` | Rahul Sharma (Citizen) |
| **CITIZEN 2** | `john.doe@gmail.com` | `citizen123` | John Doe (Citizen) |

*Note: On the login page, you can click the quick demo buttons to auto-fill these credentials instantly!*

---

## 10. API Overview

### Authentication
- `POST /api/auth/register` - Register a new citizen account
- `POST /api/auth/login` - Authenticate user & get JWT token
- `POST /api/auth/logout` - User logout

### Citizen
- `GET /api/citizens/profile` - View profile
- `PUT /api/citizens/profile` - Update profile & password
- `POST /api/citizens/complaints` - Submit a new complaint (with optional file upload)
- `GET /api/citizens/complaints/my` - View my submitted complaints
- `GET /api/citizens/complaints/:id` - View single complaint details & tracking history
- `GET /api/citizens/notifications` - Get notifications list
- `PUT /api/citizens/notifications/:id/read` - Mark notification as read
- `POST /api/citizens/feedback` - Submit 1-5 star feedback for resolved complaint

### Officer
- `GET /api/officer/profile` - View officer & department details
- `GET /api/officer/complaints` - View assigned complaints for officer's department
- `GET /api/officer/complaints/:id` - View single complaint details & citizen contact info
- `PUT /api/officer/complaints/:id/status` - Update status (`In Progress`, `Resolved`, `Rejected`) & resolution notes

### Admin
- `GET /api/admin/users` - View all users
- `POST /api/admin/users/officer` - Create new department officer
- `PUT /api/admin/users/:id/status` - Activate / deactivate user account
- `GET /api/admin/departments` - View departments
- `POST /api/admin/departments` - Create new department
- `PUT /api/admin/departments/:id` - Edit department details
- `GET /api/admin/complaints` - View all complaints
- `PUT /api/admin/complaints/:id/assign` - Assign complaint to department & officer
- `GET /api/admin/feedback` - View citizen feedback entries
- `GET /api/admin/reports` - Generate analytical report statistics

---

## 11. Project Directory Structure
```
civicconnect/
│
├── database/
│   ├── schema.sql
│   └── sample_data.sql
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── citizenController.js
│   │   └── officerController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── citizen.js
│   │   ├── officer.js
│   │   └── public.js
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── StatusTracker.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   ├── MyComplaints.jsx
│   │   │   ├── ComplaintDetails.jsx
│   │   │   ├── CitizenProfile.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── OfficerDashboard.jsx
│   │   │   ├── DepartmentProfile.jsx
│   │   │   ├── AssignedComplaints.jsx
│   │   │   ├── OfficerComplaintDetails.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── DepartmentManagement.jsx
│   │   │   ├── AdminComplaintManagement.jsx
│   │   │   ├── FeedbackMonitoring.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json
└── README.md
```
