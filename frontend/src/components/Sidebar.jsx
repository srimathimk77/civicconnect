import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    FilePlus, 
    ListFilter, 
    Bell, 
    MessageSquareHeart, 
    User, 
    Building, 
    Users, 
    FileText, 
    BarChart3,
    CheckCircle2
} from 'lucide-react';

export const Sidebar = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <aside className="sidebar">
            <div className="sidebar-heading">Navigation Menu</div>

            {user.role === 'CITIZEN' && (
                <>
                    <NavLink to="/citizen/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                    <NavLink to="/citizen/submit-complaint" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <FilePlus size={18} /> Submit Complaint
                    </NavLink>
                    <NavLink to="/citizen/my-complaints" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <ListFilter size={18} /> My Complaints
                    </NavLink>
                    <NavLink to="/citizen/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <Bell size={18} /> Notifications
                    </NavLink>
                    <NavLink to="/citizen/feedback" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <MessageSquareHeart size={18} /> Feedback
                    </NavLink>
                    <NavLink to="/citizen/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <User size={18} /> Profile
                    </NavLink>
                </>
            )}

            {user.role === 'OFFICER' && (
                <>
                    <NavLink to="/officer/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                    <NavLink to="/officer/department-profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <Building size={18} /> Department Profile
                    </NavLink>
                    <NavLink to="/officer/assigned-complaints" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <CheckCircle2 size={18} /> Assigned Complaints
                    </NavLink>
                </>
            )}

            {user.role === 'ADMIN' && (
                <>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <Users size={18} /> Users Management
                    </NavLink>
                    <NavLink to="/admin/departments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <Building size={18} /> Departments
                    </NavLink>
                    <NavLink to="/admin/complaints" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <FileText size={18} /> Complaints Management
                    </NavLink>
                    <NavLink to="/admin/feedback" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <MessageSquareHeart size={18} /> Feedback Monitoring
                    </NavLink>
                    <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <BarChart3 size={18} /> Reports
                    </NavLink>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
