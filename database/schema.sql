-- CivicConnect Database Schema (MySQL)
-- Created for Civic Complaint Management and Public Service Platform

CREATE DATABASE IF NOT EXISTS civicconnect;
USE civicconnect;

-- Drop existing tables if re-initialising
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS complaint_status_history;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;

-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role ENUM('CITIZEN', 'OFFICER', 'ADMIN') NOT NULL DEFAULT 'CITIZEN',
    department_id INT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. COMPLAINTS TABLE
CREATE TABLE complaints (
    complaint_id VARCHAR(50) PRIMARY KEY,
    citizen_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    complaint_date DATE NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium',
    department_id INT NULL,
    officer_id INT NULL,
    status ENUM('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Submitted',
    resolution_description TEXT NULL,
    resolution_date DATETIME NULL,
    image_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (officer_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. COMPLAINT STATUS HISTORY TABLE
CREATE TABLE complaint_status_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    updated_by INT NOT NULL,
    remarks TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    complaint_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. FEEDBACK TABLE
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL UNIQUE,
    citizen_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    FOREIGN KEY (citizen_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
