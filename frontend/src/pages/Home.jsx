import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle, ShieldCheck, Clock, FilePlus, Building2, ArrowRight } from 'lucide-react';

export const Home = () => {
    const [stats, setStats] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPublicData = async () => {
            try {
                const data = await api.getPublicStats();
                const depts = await api.getPublicDepartments();
                setStats(data.stats);
                setDepartments(depts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPublicData();
    }, []);

    return (
        <div>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#fff',
                padding: '4rem 2rem',
                borderRadius: '16px',
                marginBottom: '2.5rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ maxWidth: '800px' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        CIVIC COMPLAINT MANAGEMENT PLATFORM
                    </span>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1rem', lineHeight: 1.2 }}>
                        Empowering Citizens, Resolving Community Civic Issues Fast.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginTop: '1rem', marginBottom: '2rem' }}>
                        Report civic complaints directly to municipal government departments, track real-time status updates, and provide feedback on completed resolutions.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                            <FilePlus size={20} /> Register & Report Complaint
                        </Link>
                        <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', color: '#fff', borderColor: '#475569' }}>
                            Login to Portal <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Platform Impact Stats */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
                Platform Public Statistics
            </h2>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <FilePlus />
                    </div>
                    <div>
                        <div className="stat-value">{stats ? stats.totalComplaints : '0'}</div>
                        <div className="stat-label">Total Complaints Reported</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <CheckCircle />
                    </div>
                    <div>
                        <div className="stat-value">{stats ? stats.resolvedComplaints : '0'}</div>
                        <div className="stat-label">Resolved Complaints</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Building2 />
                    </div>
                    <div>
                        <div className="stat-value">{stats ? stats.totalDepartments : '0'}</div>
                        <div className="stat-label">Municipal Departments</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <ShieldCheck />
                    </div>
                    <div>
                        <div className="stat-value">{stats ? stats.activeCitizens : '0'}</div>
                        <div className="stat-label">Registered Citizens</div>
                    </div>
                </div>
            </div>

            {/* Municipal Departments Section */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2rem 0 1rem 0', color: '#0f172a' }}>
                Participating Government Departments
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {departments.map((dept) => (
                    <div key={dept.department_id} className="card" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.5rem', borderRadius: '8px' }}>
                                <Building2 size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{dept.department_name}</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{dept.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
