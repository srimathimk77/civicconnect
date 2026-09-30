import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchNotificationsCount } = useAuth();

    const loadNotifications = async () => {
        try {
            const data = await api.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
            fetchNotificationsCount();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">In-app complaint status updates & system announcements</p>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p style={{ color: '#64748b', padding: '1rem 0' }}>No notifications found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map((n) => (
                            <div key={n.notification_id} style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                background: n.is_read ? '#f8fafc' : '#eff6ff',
                                border: `1px solid ${n.is_read ? '#e2e8f0' : '#bfdbfe'}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{
                                        background: n.is_read ? '#e2e8f0' : '#2563eb',
                                        color: n.is_read ? '#64748b' : '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '8px'
                                    }}>
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: n.is_read ? 500 : 700, color: '#1e293b', fontSize: '0.95rem' }}>
                                            {n.message}
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {new Date(n.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Link to={`/citizen/complaints/${n.complaint_id}`} className="btn btn-outline btn-sm">
                                        <FileText size={14} /> View Complaint
                                    </Link>
                                    {!n.is_read && (
                                        <button onClick={() => handleMarkRead(n.notification_id)} className="btn btn-secondary btn-sm" title="Mark Read">
                                            <Check size={14} /> Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
