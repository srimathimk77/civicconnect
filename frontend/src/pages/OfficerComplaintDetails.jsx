import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import StatusTracker from '../components/StatusTracker';
import { ArrowLeft, User, Phone, Mail, MapPin, FileText, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export const OfficerComplaintDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Status Update Form State
    const [newStatus, setNewStatus] = useState('In Progress');
    const [remarks, setRemarks] = useState('');
    const [resolutionDescription, setResolutionDescription] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchDetails = async () => {
        try {
            const res = await api.getOfficerComplaintDetails(id);
            setData(res);
            if (res.complaint) {
                setNewStatus(res.complaint.status === 'Submitted' ? 'Assigned' : res.complaint.status);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setStatusMsg('');
        setErrorMsg('');

        if (newStatus === 'Resolved' && (!resolutionDescription || resolutionDescription.trim() === '')) {
            setErrorMsg('Resolution description is required when marking a complaint as Resolved.');
            return;
        }

        setSubmitting(true);

        try {
            await api.updateComplaintStatus(id, {
                status: newStatus,
                remarks,
                resolution_description: resolutionDescription
            });
            setStatusMsg(`Complaint status successfully updated to "${newStatus}"! Notification sent to citizen.`);
            fetchDetails();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to update complaint status.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="card"><p style={{ color: '#64748b' }}>Loading complaint details...</p></div>;
    }

    if (!data || !data.complaint) {
        return (
            <div className="card">
                <h2>Complaint Not Found</h2>
                <Link to="/officer/assigned-complaints" className="btn btn-outline">Back to Queue</Link>
            </div>
        );
    }

    const { complaint, history } = data;

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/officer/assigned-complaints" className="btn btn-outline btn-sm">
                    <ArrowLeft size={15} /> Back to Assigned Queue
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

            <div style={{ marginBottom: '1.5rem' }}>
                <StatusTracker currentStatus={complaint.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div>
                    {/* Complaint Overview */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                            Issue Details
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
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Reported Date</span>
                                <strong style={{ color: '#0f172a' }}>{complaint.complaint_date}</strong>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Department</span>
                                <strong style={{ color: '#0f172a' }}>{complaint.department_name}</strong>
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
                            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Citizen Description</span>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.6 }}>
                                {complaint.description}
                            </div>
                        </div>

                        {complaint.image_path && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Attachment Photo/Document</span>
                                <a href={complaint.image_path} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                    <FileText size={15} /> Open Attached Image
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Status History Log */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                            Audit & Status History Log
                        </h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Old Status</th>
                                        <th>New Status</th>
                                        <th>Updated By</th>
                                        <th>Remarks</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((h) => (
                                        <tr key={h.history_id}>
                                            <td><StatusBadge status={h.old_status} /></td>
                                            <td><StatusBadge status={h.new_status} /></td>
                                            <td>{h.updated_by_name} ({h.updated_by_role})</td>
                                            <td>{h.remarks || 'N/A'}</td>
                                            <td>{new Date(h.updated_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Officer Actions Sidebar */}
                <div>
                    {/* Citizen Contact Details for Officer */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>
                            Citizen Contact Details
                        </h3>
                        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={15} /> {complaint.citizen_name}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Phone size={14} /> {complaint.citizen_phone}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Mail size={14} /> {complaint.citizen_email}
                            </p>
                        </div>
                    </div>

                    {/* Officer Status Action Form */}
                    <div className="card" style={{ borderTop: '4px solid #2563eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                            Update Complaint Status
                        </h3>

                        {statusMsg && <div className="alert alert-success"><CheckCircle size={18} /> {statusMsg}</div>}
                        {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

                        <form onSubmit={handleStatusUpdate}>
                            <div className="form-group">
                                <label className="form-label">Select New Status *</label>
                                <select
                                    className="form-select"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    required
                                >
                                    <option value="Assigned">Assigned (Acknowledged)</option>
                                    <option value="In Progress">In Progress (Work Dispatched)</option>
                                    <option value="Resolved">Resolved (Work Completed)</option>
                                    <option value="Rejected">Rejected (Invalid/Outside Jurisdiction)</option>
                                </select>
                            </div>

                            {newStatus === 'Resolved' && (
                                <div className="form-group">
                                    <label className="form-label">Resolution Summary / Action Taken *</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Specify repair work details, contractor name, date of completion..."
                                        value={resolutionDescription}
                                        onChange={(e) => setResolutionDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Officer Remarks / Comments</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Internal notes or updates for history log..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                {submitting ? 'Updating...' : 'Save & Update Status'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficerComplaintDetails;
