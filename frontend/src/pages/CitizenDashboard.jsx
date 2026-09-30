import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { FilePlus, Clock, CheckCircle2, AlertCircle, Bell, ArrowRight } from 'lucide-react';

export const CitizenDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const list = await api.getMyComplaints();
                const notes = await api.getNotifications();
                setComplaints(list);
                setNotifications(notes.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const submittedCount = complaints.filter(c => c.status === 'Submitted').length;
    const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Welcome back, {user?.name}!</h1>
                    <p className="page-subtitle">Citizen Complaint Dashboard & Activity Overview</p>
                </div>
                <Link to="/citizen/submit-complaint" className="btn btn-primary">
                    <FilePlus size={18} /> Submit New Complaint
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <FilePlus />
                    </div>
                    <div>
                        <div className="stat-value">{complaints.length}</div>
                        <div className="stat-label">Total Submitted Complaints</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Clock />
                    </div>
                    <div>
                        <div className="stat-value">{submittedCount}</div>
                        <div className="stat-label">Submitted (Pending Review)</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <AlertCircle />
                    </div>
                    <div>
                        <div className="stat-value">{inProgressCount}</div>
                        <div className="stat-label">In Progress / Assigned</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <CheckCircle2 />
                    </div>
                    <div>
                        <div className="stat-value">{resolvedCount}</div>
                        <div className="stat-label">Successfully Resolved</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Recent Complaints Table */}
                <div className="card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>My Recent Complaints</h3>
                        <Link to="/citizen/my-complaints" style={{ fontSize: '0.875rem', fontWeight: 600 }}>View All</Link>
                    </div>

                    {loading ? (
                        <p style={{ color: '#64748b' }}>Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p style={{ color: '#64748b' }}>You haven't submitted any complaints yet.</p>
                    ) : (
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.slice(0, 5).map((c) => (
                                        <tr key={c.complaint_id}>
                                            <td style={{ fontWeight: 700 }}>{c.complaint_id}</td>
                                            <td>{c.title}</td>
                                            <td>{c.category}</td>
                                            <td><StatusBadge status={c.status} /></td>
                                            <td>
                                                <Link to={`/citizen/complaints/${c.complaint_id}`} className="btn btn-outline btn-sm">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Notifications Sidebar Box */}
                <div className="card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bell size={18} /> Notifications
                        </h3>
                        <Link to="/citizen/notifications" style={{ fontSize: '0.85rem' }}>See All</Link>
                    </div>

                    {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No notifications found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {notifications.map((n) => (
                                <div key={n.notification_id} style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: n.is_read ? '#f8fafc' : '#eff6ff',
                                    border: `1px solid ${n.is_read ? '#e2e8f0' : '#bfdbfe'}`
                                }}>
                                    <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: n.is_read ? 400 : 600 }}>{n.message}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                                        {new Date(n.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
