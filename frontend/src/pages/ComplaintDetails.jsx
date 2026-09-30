import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import StatusTracker from '../components/StatusTracker';
import { ArrowLeft, MapPin, Calendar, Building, User, FileText, CheckCircle, Star, MessageSquare } from 'lucide-react';

export const ComplaintDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Feedback Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const fetchDetails = async () => {
        try {
            const res = await api.getComplaintById(id);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setFeedbackError('');
        setFeedbackSuccess('');
        setSubmittingFeedback(true);

        try {
            await api.submitFeedback({
                complaint_id: id,
                rating,
                comment
            });
            setFeedbackSuccess('Thank you! Your feedback has been recorded.');
            fetchDetails();
        } catch (err) {
            setFeedbackError(err.message || 'Error submitting feedback.');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return <div className="card"><p style={{ color: '#64748b' }}>Loading complaint details...</p></div>;
    }

    if (!data || !data.complaint) {
        return (
            <div className="card">
                <h2>Complaint Not Found</h2>
                <p>No complaint records exist for ID: {id}</p>
                <Link to="/citizen/my-complaints" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to My Complaints</Link>
            </div>
        );
    }

    const { complaint, history, feedback } = data;

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/citizen/my-complaints" className="btn btn-outline btn-sm">
                    <ArrowLeft size={15} /> Back to My Complaints
                </Link>
            </div>

            <div className="page-header" style={{ marginBottom: '1.25rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{complaint.complaint_id}</span>
                        <StatusBadge status={complaint.status} />
                    </div>
                    <h1 className="page-title" style={{ marginTop: '0.25rem' }}>{complaint.title}</h1>
                </div>
            </div>

            {/* Status Visual Timeline Tracker */}
            <div style={{ marginBottom: '1.5rem' }}>
                <StatusTracker currentStatus={complaint.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div>
                    {/* Main Details Card */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                            Complaint Overview
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Category</span>
                                <strong style={{ color: '#0f172a' }}>{complaint.category}</strong>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Priority</span>
                                <PriorityBadge priority={complaint.priority} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Date Submitted</span>
                                <strong style={{ color: '#0f172a' }}>{complaint.complaint_date}</strong>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Assigned Department</span>
                                <strong style={{ color: '#0f172a' }}>{complaint.department_name || 'Pending Assignment'}</strong>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Location / Address</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <MapPin size={18} color="#2563eb" />
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{complaint.location}</span>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Problem Description</span>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.6 }}>
                                {complaint.description}
                            </div>
                        </div>

                        {complaint.image_path && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Attached File / Photo</span>
                                <a href={complaint.image_path} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                    <FileText size={15} /> View Attached Document/Photo
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Resolution Section if Resolved */}
                    {complaint.status === 'Resolved' && (
                        <div className="card" style={{ borderLeft: '4px solid #16a34a', background: '#f0fdf4' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <CheckCircle size={22} color="#16a34a" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d' }}>Resolution Information</h3>
                            </div>
                            <p style={{ color: '#166534', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                                <strong>Work Completed:</strong> {complaint.resolution_description || 'Department officer resolved this complaint.'}
                            </p>
                            <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
                                Resolved Date: {complaint.resolution_date ? new Date(complaint.resolution_date).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    )}

                    {/* Status Update History Log */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                            Status Update History Log
                        </h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Old Status</th>
                                        <th>New Status</th>
                                        <th>Updated By</th>
                                        <th>Remarks</th>
                                        <th>Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((h) => (
                                        <tr key={h.history_id}>
                                            <td><StatusBadge status={h.old_status} /></td>
                                            <td><StatusBadge status={h.new_status} /></td>
                                            <td>{h.updated_by_name} ({h.updated_by_role})</td>
                                            <td>{h.remarks || 'No remarks'}</td>
                                            <td>{new Date(h.updated_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Department Info & Citizen Feedback */}
                <div>
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>
                            Handling Department
                        </h3>
                        {complaint.department_name ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Building size={18} color="#2563eb" />
                                    <strong>{complaint.department_name}</strong>
                                </div>
                                {complaint.officer_name && (
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        Assigned Officer: {complaint.officer_name}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Waiting for System Admin to assign to appropriate municipal department.
                            </p>
                        )}
                    </div>

                    {/* Feedback Form for Resolved Complaints */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Citizen Feedback
                        </h3>

                        {complaint.status !== 'Resolved' ? (
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                Feedback can be submitted only after the complaint is resolved.
                            </p>
                        ) : feedback ? (
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', color: '#eab308' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < feedback.rating ? '#eab308' : 'none'} color={i < feedback.rating ? '#eab308' : '#cbd5e1'} />
                                    ))}
                                    <span style={{ fontWeight: 700, color: '#1e293b', marginLeft: '0.5rem' }}>{feedback.rating} / 5 Stars</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#475569' }}>"{feedback.comment}"</p>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>
                                    Submitted on {new Date(feedback.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ) : (
                            <div>
                                {feedbackSuccess && <div className="alert alert-success">{feedbackSuccess}</div>}
                                {feedbackError && <div className="alert alert-error">{feedbackError}</div>}

                                <form onSubmit={handleFeedbackSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Rating (1 to 5 Stars)</label>
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
                                                    <Star size={24} fill={star <= rating ? '#eab308' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Feedback Comments</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            placeholder="Write your experience regarding resolution speed and quality..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }} disabled={submittingFeedback}>
                                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
