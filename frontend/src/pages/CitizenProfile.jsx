import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Phone, MapPin, Mail, Key, CheckCircle, ShieldAlert } from 'lucide-react';

export const CitizenProfile = () => {
    const { user, updateUserState } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        newPassword: ''
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                newPassword: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setLoading(true);

        try {
            const res = await api.updateCitizenProfile({
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                newPassword: formData.newPassword
            });

            updateUserState(res.user);
            setSuccessMsg('Profile updated successfully!');
            setFormData(prev => ({ ...prev, newPassword: '' }));
        } catch (err) {
            setErrorMsg(err.message || 'Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">View and update your personal citizen details & password</p>
                </div>
            </div>

            <div className="card">
                {successMsg && <div className="alert alert-success"><CheckCircle size={18} /> {successMsg}</div>}
                {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address (Cannot be changed)</label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            disabled
                            style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Residential Address *</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

                    <div className="form-group">
                        <label className="form-label">Change Password (Leave blank to keep current password)</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password (min 6 chars)"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Saving Changes...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CitizenProfile;
