import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MessageSquareHeart, Star, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeedbackPage = () => {
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [selectedComplaintId, setSelectedComplaintId] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const list = await api.getMyComplaints();
            const resolved = list.filter(c => c.status === 'Resolved');
            setResolvedComplaints(resolved);
            if (resolved.length > 0) {
                setSelectedComplaintId(resolved[0].complaint_id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        if (!selectedComplaintId) {
            setErrorMsg('Please select a resolved complaint.');
            return;
        }

        try {
            await api.submitFeedback({
                complaint_id: selectedComplaintId,
                rating,
                comment
            });
            setSuccessMsg(`Feedback submitted successfully for complaint ${selectedComplaintId}!`);
            setComment('');
        } catch (err) {
            setErrorMsg(err.message || 'Failed to submit feedback.');
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Citizen Feedback</h1>
                    <p className="page-subtitle">Rate and review municipal service performance for resolved complaints</p>
                </div>
            </div>

            <div className="card">
                {successMsg && <div className="alert alert-success"><CheckCircle size={18} /> {successMsg}</div>}
                {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading resolved complaints...</p>
                ) : resolvedComplaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <MessageSquareHeart size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ color: '#64748b' }}>You currently have no resolved complaints eligible for feedback.</p>
                        <Link to="/citizen/my-complaints" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                            View My Complaints
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Resolved Complaint *</label>
                            <select
                                className="form-select"
                                value={selectedComplaintId}
                                onChange={(e) => setSelectedComplaintId(e.target.value)}
                                required
                            >
                                {resolvedComplaints.map((c) => (
                                    <option key={c.complaint_id} value={c.complaint_id}>
                                        {c.complaint_id} - {c.title} ({c.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Satisfaction Rating (1 to 5 Stars) *</label>
                            <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: star <= rating ? '#eab308' : '#cbd5e1'
                                        }}
                                    >
                                        <Star size={32} fill={star <= rating ? '#eab308' : 'none'} />
                                    </button>
                                ))}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                Selected Rating: {rating} / 5 Stars
                            </span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Comments / Suggestions</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Share your experience regarding resolution quality, speed, and officer conduct..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                            Submit Official Feedback
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
