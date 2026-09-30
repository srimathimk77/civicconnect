import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Building, User, Mail, Phone, ShieldCheck } from 'lucide-react';

export const DepartmentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getOfficerProfile();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="card"><p style={{ color: '#64748b' }}>Loading department officer profile...</p></div>;
    }

    return (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Department Profile</h1>
                    <p className="page-subtitle">Government Officer & Department Credentials</p>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#eff6ff', color: '#2563eb', padding: '1rem', borderRadius: '12px' }}>
                        <Building size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                            {profile?.department_name || 'Department Officer'}
                        </h2>
                        <span className="role-pill role-OFFICER">Government Department Officer</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={14} /> Officer Full Name
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#1e293b', marginTop: '0.25rem', display: 'block' }}>
                            {profile?.name}
                        </strong>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Mail size={14} /> Officer Email Address
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#1e293b', marginTop: '0.25rem', display: 'block' }}>
                            {profile?.email}
                        </strong>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Phone size={14} /> Official Contact Phone
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#1e293b', marginTop: '0.25rem', display: 'block' }}>
                            {profile?.phone}
                        </strong>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={14} /> Authorization Level
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#1e293b', marginTop: '0.25rem', display: 'block' }}>
                            Authorized Municipal Officer
                        </strong>
                    </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                        Department Mandate & Description
                    </span>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569' }}>
                        {profile?.department_description || 'Responsible for handling complaints assigned to this department.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentProfile;
