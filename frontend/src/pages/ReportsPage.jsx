import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart3, Users, Building, CheckCircle2, Star, FileText } from 'lucide-react';

export const ReportsPage = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.getAdminReports();
                setReports(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return <div className="card"><p style={{ color: '#64748b' }}>Generating platform system reports...</p></div>;
    }

    const totals = reports.totals;
    const statusBk = reports.statusBreakdown;
    const categoryBk = reports.categoryBreakdown;
    const departmentBk = reports.departmentBreakdown;
    const feedbackSum = reports.feedbackSummary;

    const maxCatCount = Math.max(...categoryBk.map(c => c.count), 1);
    const maxDeptCount = Math.max(...departmentBk.map(d => d.count), 1);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Platform Analytical Reports</h1>
                    <p className="page-subtitle">Simple, aggregated metrics for academic SRS documentation & viva evaluation</p>
                </div>
            </div>

            {/* 1. Summary Statistics Cards */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                1. System Overview Metrics
            </h3>
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
                        <div className="stat-label">Government Officers</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <Building />
                    </div>
                    <div>
                        <div className="stat-value">{totals.departments}</div>
                        <div className="stat-label">Departments</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <Star />
                    </div>
                    <div>
                        <div className="stat-value">{feedbackSum.avgRating} / 5</div>
                        <div className="stat-label">Avg Feedback ({feedbackSum.totalFeedback} Reviews)</div>
                    </div>
                </div>
            </div>

            {/* 2. Complaints Status Breakdown Table & Progress */}
            <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                    2. Complaint Status Distribution Report
                </h3>
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Status Type</th>
                                <th>Count</th>
                                <th>Percentage of Total ({totals.complaints})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(statusBk).map(([status, count]) => {
                                const pct = totals.complaints > 0 ? ((count / totals.complaints) * 100).toFixed(1) : 0;
                                return (
                                    <tr key={status}>
                                        <td style={{ fontWeight: 700 }}>{status}</td>
                                        <td><strong style={{ fontSize: '1.05rem' }}>{count}</strong></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ flex: 1, background: '#e2e8f0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${pct}%`,
                                                        height: '100%',
                                                        background: status === 'Resolved' ? '#16a34a' : status === 'Rejected' ? '#dc2626' : '#2563eb'
                                                    }}></div>
                                                </div>
                                                <span style={{ fontWeight: 600, minWidth: '45px' }}>{pct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Category & Department Visual Distribution Bar Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Complaints by Category Chart */}
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                        3. Complaints by Category
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categoryBk.map((cat) => {
                            const barPct = ((cat.count / maxCatCount) * 100).toFixed(0);
                            return (
                                <div key={cat.category}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{cat.category}</span>
                                        <span style={{ fontWeight: 700, color: '#2563eb' }}>{cat.count} complaints</span>
                                    </div>
                                    <div style={{ background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${barPct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', borderRadius: '6px' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Complaints by Department Chart */}
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                        4. Complaints by Department
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {departmentBk.map((dept) => {
                            const barPct = ((dept.count / maxDeptCount) * 100).toFixed(0);
                            return (
                                <div key={dept.department_name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{dept.department_name}</span>
                                        <span style={{ fontWeight: 700, color: '#0284c7' }}>{dept.count} complaints</span>
                                    </div>
                                    <div style={{ background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${barPct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #0284c7)', borderRadius: '6px' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
