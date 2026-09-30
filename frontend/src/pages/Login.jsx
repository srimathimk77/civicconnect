import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.login(email, password);
            login(res.user, res.token);

            // Redirect based on role
            if (res.user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (res.user.role === 'OFFICER') {
                navigate('/officer/dashboard');
            } else {
                navigate('/citizen/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to auto-fill sample demo accounts
    const fillDemo = (role) => {
        if (role === 'ADMIN') {
            setEmail('admin@civicconnect.com');
            setPassword('admin123');
        } else if (role === 'OFFICER') {
            setEmail('officer@roads.com');
            setPassword('officer123');
        } else if (role === 'CITIZEN') {
            setEmail('citizen@gmail.com');
            setPassword('citizen123');
        }
    };

    return (
        <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="brand-icon" style={{ margin: '0 auto 0.75rem auto', width: '48px', height: '48px' }}>
                        <LogIn size={26} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Account Login</h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Enter your credentials to access CivicConnect</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <ShieldAlert size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                {/* Quick Test Demo Credentials Bar */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Demo Test Credentials (Viva Helper)
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button type="button" onClick={() => fillDemo('CITIZEN')} className="btn btn-outline btn-sm">
                            Citizen
                        </button>
                        <button type="button" onClick={() => fillDemo('OFFICER')} className="btn btn-outline btn-sm">
                            Officer
                        </button>
                        <button type="button" onClick={() => fillDemo('ADMIN')} className="btn btn-outline btn-sm">
                            Admin
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" style={{ fontWeight: 700 }}>Register as Citizen</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
