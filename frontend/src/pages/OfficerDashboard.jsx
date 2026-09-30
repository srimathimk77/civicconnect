import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { Building, CheckCircle2, Clock, AlertCircle, Eye, FileText } from 'lucide-react';

export const OfficerDashboard = () => {
    const { user } = useAuth();
    const [officerInfo, setOfficerInfo] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const info = await api.getOfficerProfile();
                const list = await api.getOfficerComplaints();
                setOfficerInfo(info);
                setComplaints(list);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const assignedCount = complaints.filter(c => c.status === 'Assigned').length;
    const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Department Officer Portal</h1>
                    <p className="page-subtitle">
                        Officer: {user?.name} | Department: {officerInfo?.department_name || 'Loading...'}
                    </p>
                </div>
                <Link to="/officer/assigned-complaints" className="btn btn-primary">
                    <CheckCircle2 size={18} /> Manage Assigned Complaints
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <FileText />
                    </div>
                    <div>
                        <div className="stat-value">{complaints.length}</div>
                        <div className="stat-label">Total Assigned Complaints</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Clock />
                    </div>
                    <div>
                        <div className="stat-value">{assignedCount}</div>
                        <div className="stat-label">Pending Review (Assigned)</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <AlertCircle />
                    </div>
                    <div>
                        <div className="stat-value">{inProgressCount}</div>
                        <div className="stat-label">In-Progress Work</div>
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

            <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                    Recent Department Complaints Queue
                </h3>

                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading assigned complaints...</p>
                ) : complaints.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No complaints assigned to your department yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Citizen</th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.slice(0, 5).map((c) => (
                                    <tr key={c.complaint_id}>
                                        <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.complaint_id}</td>
                                        <td>{c.citizen_name} ({c.citizen_phone})</td>
                                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                                        <td>{c.location}</td>
                                        <td>{c.complaint_date}</td>
                                        <td><PriorityBadge priority={c.priority} /></td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td>
                                            <Link to={`/officer/complaints/${c.complaint_id}`} className="btn btn-outline btn-sm">
                                                <Eye size={14} /> Handle
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficerDashboard;
