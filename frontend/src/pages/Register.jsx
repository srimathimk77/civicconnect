import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserPlus, ShieldAlert } from 'lucide-react';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const res = await api.register(formData);
            login(res.user, res.token);
            navigate('/citizen/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="brand-icon" style={{ margin: '0 auto 0.75rem auto', width: '48px', height: '48px' }}>
                        <UserPlus size={26} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Citizen Registration</h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Create an account to submit & track civic complaints</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <ShieldAlert size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="e.g. Anish Kumar"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="name@domain.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password * (Min 6 characters)</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Residential Address *</label>
                        <textarea
                            name="address"
                            className="form-control"
                            rows={3}
                            placeholder="House number, Street, Ward, Area"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
                    Already registered? <Link to="/login" style={{ fontWeight: 700 }}>Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
