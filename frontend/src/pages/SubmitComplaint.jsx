import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FilePlus, ShieldAlert, CheckCircle, Upload } from 'lucide-react';

export const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Road Damage',
        location: '',
        priority: 'Medium',
        description: ''
    });
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState('');
    const [successId, setSuccessId] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const categories = [
        'Road Damage',
        'Garbage/Waste',
        'Street Light',
        'Water Supply',
        'Drainage',
        'Electricity',
        'Public Safety',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('location', formData.location);
            data.append('priority', formData.priority);
            data.append('description', formData.description);
            if (attachment) {
                data.append('attachment', attachment);
            }

            const res = await api.submitComplaint(data);
            setSuccessId(res.complaint_id);
        } catch (err) {
            setError(err.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Submit Civic Complaint</h1>
                    <p className="page-subtitle">Report a public service or infrastructure issue in your locality</p>
                </div>
            </div>

            {successId ? (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '9999px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                        <CheckCircle size={36} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Complaint Submitted Successfully!</h2>
                    <p style={{ color: '#475569', marginTop: '0.5rem' }}>
                        Your unique Complaint Reference ID is: <strong style={{ color: '#2563eb', fontSize: '1.25rem' }}>{successId}</strong>
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                        Initial status has been set to <strong>"Submitted"</strong>. Municipal authorities have been notified.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => { setSuccessId(''); setFormData({ title: '', category: 'Road Damage', location: '', priority: 'Medium', description: '' }); }} className="btn btn-outline">
                            Submit Another Complaint
                        </button>
                        <button onClick={() => navigate(`/citizen/complaints/${successId}`)} className="btn btn-primary">
                            Track Complaint Status
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card">
                    {error && (
                        <div className="alert alert-error">
                            <ShieldAlert size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Complaint Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g. Deep pothole on Main Street near Bus Stop"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Complaint Category *</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Priority Level</label>
                                <select
                                    name="priority"
                                    className="form-select"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Specific Location / Address *</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                placeholder="Street name, landmark, ward number, area"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Detailed Description *</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows={4}
                                placeholder="Describe the issue, cause, duration, and any hazards..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Optional Photo / Document Attachment</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                Upload a photo of the damaged road, garbage dump, or defect (Max size: 5MB)
                            </small>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SubmitComplaint;
