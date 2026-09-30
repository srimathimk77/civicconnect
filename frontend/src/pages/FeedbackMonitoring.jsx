import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Star, MessageSquareHeart } from 'lucide-react';

export const FeedbackMonitoring = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await api.getAdminFeedback();
                setFeedbackList(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const avgRating = feedbackList.length > 0
        ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
        : '0.0';

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Citizen Feedback Monitoring</h1>
                    <p className="page-subtitle">Monitor ratings and service satisfaction comments from citizens</p>
                </div>
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={20} fill="#eab308" color="#eab308" />
                    <div>
                        <strong style={{ fontSize: '1.1rem', color: '#92400e' }}>{avgRating} / 5.0</strong>
                        <span style={{ fontSize: '0.75rem', color: '#b45309', display: 'block' }}>Average Citizen Rating</span>
                    </div>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading feedback entries...</p>
                ) : feedbackList.length === 0 ? (
                    <p style={{ color: '#64748b', padding: '1rem 0' }}>No citizen feedback recorded yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Feedback ID</th>
                                    <th>Complaint ID</th>
                                    <th>Citizen</th>
                                    <th>Category</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbackList.map((f) => (
                                    <tr key={f.feedback_id}>
                                        <td>#{f.feedback_id}</td>
                                        <td style={{ fontWeight: 800, color: '#2563eb' }}>{f.complaint_id}</td>
                                        <td>
                                            <span style={{ fontWeight: 600, display: 'block' }}>{f.citizen_name}</span>
                                            <small style={{ color: '#64748b' }}>{f.citizen_email}</small>
                                        </td>
                                        <td>{f.category}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#eab308' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < f.rating ? '#eab308' : 'none'} color={i < f.rating ? '#eab308' : '#cbd5e1'} />
                                                ))}
                                                <strong style={{ marginLeft: '0.25rem', color: '#1e293b', fontSize: '0.85rem' }}>{f.rating}</strong>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '300px', fontStyle: f.comment ? 'normal' : 'italic', color: f.comment ? '#334155' : '#94a3b8' }}>
                                            {f.comment || 'No comment provided'}
                                        </td>
                                        <td>{new Date(f.created_at).toLocaleDateString()}</td>
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

export default FeedbackMonitoring;
