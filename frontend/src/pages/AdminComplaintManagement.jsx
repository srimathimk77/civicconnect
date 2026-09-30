import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { Search, Filter, UserCheck, CheckCircle, ShieldAlert, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Assignment Modal state
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [assignDeptId, setAssignDeptId] = useState('');
    const [assignOfficerId, setAssignOfficerId] = useState('');
    const [assignRemarks, setAssignRemarks] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submittingAssign, setSubmittingAssign] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const comp = await api.getAdminComplaints({
                status: statusFilter,
                category: categoryFilter,
                department_id: deptFilter,
                search: searchTerm
            });
            const depts = await api.getAdminDepartments();
            const users = await api.getAdminUsers();

            setComplaints(comp);
            setDepartments(depts);
            setOfficers(users.filter(u => u.role === 'OFFICER'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [statusFilter, categoryFilter, deptFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadData();
    };

    const handleOpenAssignModal = (complaint) => {
        setSelectedComplaint(complaint);
        setAssignDeptId(complaint.department_id || (departments[0]?.department_id || ''));
        setAssignOfficerId(complaint.officer_id || '');
        setAssignRemarks('');
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setSubmittingAssign(true);

        try {
            await api.assignComplaint(selectedComplaint.complaint_id, {
                department_id: assignDeptId,
                officer_id: assignOfficerId || null,
                remarks: assignRemarks
            });
            setSuccessMsg(`Complaint ${selectedComplaint.complaint_id} assigned successfully! Notification sent.`);
            setSelectedComplaint(null);
            loadData();
        } catch (err) {
            setErrorMsg(err.message || 'Error assigning complaint.');
        } finally {
            setSubmittingAssign(false);
        }
    };

    // Filter officers by selected department in assignment modal
    const filteredOfficersForDept = officers.filter(o => String(o.department_id) === String(assignDeptId));

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Complaint Management & Assignment</h1>
                    <p className="page-subtitle">Assign incoming citizen complaints to government departments & officers</p>
                </div>
            </div>

            {successMsg && <div className="alert alert-success"><CheckCircle size={18} /> {successMsg}</div>}
            {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

            {/* Filter & Search Bar */}
            <form onSubmit={handleSearch} className="filter-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search ID, title, citizen name, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">Search</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select className="form-select" style={{ width: '150px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <select className="form-select" style={{ width: '160px' }} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                        <option value="">All Departments</option>
                        {departments.map(d => (
                            <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                        ))}
                    </select>
                </div>
            </form>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading complaints data...</p>
                ) : complaints.length === 0 ? (
                    <p style={{ color: '#64748b', padding: '1rem 0' }}>No complaints found matching filter criteria.</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Citizen</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Department</th>
                                    <th>Officer</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c) => (
                                    <tr key={c.complaint_id}>
                                        <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.complaint_id}</td>
                                        <td>
                                            <span style={{ fontWeight: 600, display: 'block' }}>{c.citizen_name}</span>
                                            <small style={{ color: '#64748b' }}>{c.citizen_phone}</small>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                                        <td>{c.category}</td>
                                        <td>{c.location}</td>
                                        <td>{c.department_name || <span style={{ color: '#dc2626', fontWeight: 600 }}>Unassigned</span>}</td>
                                        <td>{c.officer_name || <span style={{ color: '#94a3b8' }}>Unassigned</span>}</td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td>
                                            <button onClick={() => handleOpenAssignModal(c)} className="btn btn-primary btn-sm">
                                                <UserCheck size={14} /> Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {selectedComplaint && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Assign Department & Officer ({selectedComplaint.complaint_id})</h3>
                            <button onClick={() => setSelectedComplaint(null)} className="btn btn-outline btn-sm">X</button>
                        </div>
                        <form onSubmit={handleAssignSubmit}>
                            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                                <strong>Issue:</strong> {selectedComplaint.title} <br />
                                <strong>Category:</strong> {selectedComplaint.category} | <strong>Location:</strong> {selectedComplaint.location}
                            </p>

                            <div className="form-group">
                                <label className="form-label">Target Government Department *</label>
                                <select
                                    className="form-select"
                                    value={assignDeptId}
                                    onChange={(e) => {
                                        setAssignDeptId(e.target.value);
                                        setAssignOfficerId('');
                                    }}
                                    required
                                >
                                    <option value="">-- Select Department --</option>
                                    {departments.map(d => (
                                        <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Assign Specific Officer (Optional)</label>
                                <select
                                    className="form-select"
                                    value={assignOfficerId}
                                    onChange={(e) => setAssignOfficerId(e.target.value)}
                                >
                                    <option value="">-- Any Available Officer in Department --</option>
                                    {filteredOfficersForDept.map(o => (
                                        <option key={o.user_id} value={o.user_id}>{o.name} ({o.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Assignment Remarks / Directives</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Directives for department officer..."
                                    value={assignRemarks}
                                    onChange={(e) => setAssignRemarks(e.target.value)}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submittingAssign}>
                                    {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComplaintManagement;
