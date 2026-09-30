import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { Search, Filter, Eye } from 'lucide-react';

export const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await api.getMyComplaints();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter((c) => {
        const matchesStatus = statusFilter === '' || c.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Submitted Complaints</h1>
                    <p className="page-subtitle">Track and view history of all complaints submitted by your account</p>
                </div>
                <Link to="/citizen/submit-complaint" className="btn btn-primary">
                    Submit New Complaint
                </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search by ID, title, category, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Filter size={18} color="#64748b" />
                    <select
                        className="form-select"
                        style={{ width: '180px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading complaints list...</p>
                ) : filteredComplaints.length === 0 ? (
                    <p style={{ color: '#64748b', padding: '1rem 0' }}>No complaints found matching your filters.</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Complaint ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Priority</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.map((c) => (
                                    <tr key={c.complaint_id}>
                                        <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.complaint_id}</td>
                                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                                        <td>{c.category}</td>
                                        <td>{c.location}</td>
                                        <td>{c.complaint_date}</td>
                                        <td><PriorityBadge priority={c.priority} /></td>
                                        <td>{c.department_name || <span style={{ color: '#94a3b8' }}>Unassigned</span>}</td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td>
                                            <Link to={`/citizen/complaints/${c.complaint_id}`} className="btn btn-outline btn-sm">
                                                <Eye size={14} /> Details
                                            </Link>
                                        </td>
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

export default MyComplaints;
