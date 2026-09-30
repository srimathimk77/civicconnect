import React from 'react';
import { Shield, CheckCircle, Users, FileText, ArrowRight } from 'lucide-react';

export const About = () => {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">About CivicConnect</h1>
                    <p className="page-subtitle">Civic Complaint Management & Transparent Public Service System</p>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>
                    Platform Overview & Objective
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                    CivicConnect is an intuitive civic complaint management and public service web platform created to bridge the communication gap between citizens and municipal government authorities.
                </p>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>
                    Citizens can easily report local infrastructure and service issues such as road damage, garbage overflow, street lighting failures, water supply disruptions, and drainage problems. Complaints are systematically assigned to responsible officers, tracked in real-time, resolved efficiently, and monitored through citizen feedback.
                </p>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                    The 4 User System Roles
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#1e40af' }}>1. CITIZEN</strong>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Submits complaints, tracks status history, receives notifications, updates profile, and leaves 1-5 star ratings.</p>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#92400e' }}>2. DEPARTMENT OFFICER</strong>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Manages complaints assigned to their department, updates work status (In Progress, Resolved, Rejected), and enters resolution notes.</p>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#9d174d' }}>3. ADMIN</strong>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Oversees overall system, manages citizens/officers, creates departments, assigns complaints, monitors feedback, and generates reports.</p>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#475569' }}>4. PUBLIC/GUEST</strong>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Views public platform information, stats, login/register pages, and public platform features.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
