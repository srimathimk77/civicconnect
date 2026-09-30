import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { Users, Building, FileText, CheckCircle2, Clock, BarChart3, AlertCircle, UserPlus, Eye } from 'lucide-react';

export const AdminDashboard = () => {
    const [reports, setReports] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const rep = await api.getAdminReports();
                const comp = await api.getAdminComplaints();
                setReports(rep);
                setRecentComplaints(comp.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const totals = reports?.totals || { citizens: 0, officers: 0, departments: 0, complaints: 0 };
    const statusBk = reports?.statusBreakdown || {};

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Command Dashboard</h1>
                    <p className="page-subtitle">Overall System Administration & Management Portal</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/admin/reports" className="btn btn-primary">
                        <BarChart3 size={18} /> View Reports
                    </Link>
                </div>
            </div>

            {/* Metric Overview Grid */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <Users />
                    </div>
                    <div>
                        <div className="stat-value">{totals.citizens}</div>
                        <div className="stat-label">Registered Citizens</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Users />
                    </div>
                    <div>
                        <div className="stat-value">{totals.officers}</div>
                        <div className="stat-label">Department Officers</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <Building />
                    </div>
                    <div>
                        <div className="stat-value">{totals.departments}</div>
                        <div className="stat-label">Municipal Departments</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fce7f3', color: '#9d174d' }}>
                        <FileText />
                    </div>
                    <div>
                        <div className="stat-value">{totals.complaints}</div>
                        <div className="stat-label">Total System Complaints</div>
                    </div>
                </div>
            </div>

            {/* Status Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SUBMITTED</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{statusBk['Submitted'] || 0}</h3>
                </div>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ASSIGNED</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>{statusBk['Assigned'] || 0}</h3>
                </div>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>IN PROGRESS</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>{statusBk['In Progress'] || 0}</h3>
                </div>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>RESOLVED</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{statusBk['Resolved'] || 0}</h3>
                </div>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>REJECTED</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{statusBk['Rejected'] || 0}</h3>
                </div>
            </div>

            {/* Recent Complaints Table */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                        All System Complaints Overview
                    </h3>
                    <Link to="/admin/complaints" className="btn btn-outline btn-sm">Manage All Complaints</Link>
                </div>

                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading complaints data...</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Citizen</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Department</th>
                                    <th>Officer</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentComplaints.map((c) => (
                                    <tr key={c.complaint_id}>
                                        <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.complaint_id}</td>
                                        <td>{c.citizen_name}</td>
                                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                                        <td>{c.category}</td>
                                        <td>{c.department_name || <span style={{ color: '#dc2626', fontWeight: 600 }}>Unassigned</span>}</td>
                                        <td>{c.officer_name || <span style={{ color: '#94a3b8' }}>None</span>}</td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td>
                                            <Link to="/admin/complaints" className="btn btn-outline btn-sm">
                                                Manage
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

export default AdminDashboard;
