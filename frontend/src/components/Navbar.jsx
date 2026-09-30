import React from 'react';
import { Link as RouterLink, useNavigate as useNav } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, User, Bell, Home, Info, LogIn, UserPlus } from 'lucide-react';

export const Navbar = () => {
    const { user, logout, unreadCount } = useAuth();
    const navigate = useNav();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <RouterLink to="/" className="navbar-brand">
                <div className="brand-icon">
                    <Building2 size={22} />
                </div>
                <span>CivicConnect</span>
            </RouterLink>

            <ul className="nav-links">
                {!user ? (
                    <>
                        <li>
                            <RouterLink to="/" className="nav-link">
                                <Home size={16} /> Home
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/about" className="nav-link">
                                <Info size={16} /> About
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/login" className="nav-link">
                                <LogIn size={16} /> Login
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/register" className="btn btn-primary btn-sm">
                                <UserPlus size={16} /> Register
                            </RouterLink>
                        </li>
                    </>
                ) : (
                    <>
                        {user.role === 'CITIZEN' && (
                            <li>
                                <RouterLink to="/citizen/notifications" className="nav-link" style={{ position: 'relative' }}>
                                    <Bell size={18} /> Notifications
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-8px',
                                            background: '#dc2626',
                                            color: '#fff',
                                            fontSize: '0.65rem',
                                            fontWeight: 'bold',
                                            padding: '2px 5px',
                                            borderRadius: '10px'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </RouterLink>
                            </li>
                        )}
                        <li className="user-badge">
                            <User size={15} />
                            <span>{user.name}</span>
                            <span className={`role-pill role-${user.role}`}>{user.role}</span>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#475569' }}>
                                <LogOut size={15} /> Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
