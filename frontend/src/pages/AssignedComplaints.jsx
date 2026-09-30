import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge, { PriorityBadge } from '../components/StatusBadge';
import { Search, Filter, Eye } from 'lucide-react';

export const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAssigned = async () => {
        setLoading(true);
        try {
            const data = await api.getOfficerComplaints({
                status: statusFilter,
                search: searchTerm
            });
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssigned();
    }, [statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAssigned();
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Assigned Complaints Queue</h1>
                    <p className="page-subtitle">Manage, update status, and resolve complaints assigned to your department</p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="filter-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search by Complaint ID, citizen, title, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">Search</button>
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
                        <option value="Assigned">Assigned (Pending)</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </form>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading assigned complaints queue...</p>
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
                                    <th>Date</th>
                                    <th>Priority</th>
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
                                        <td>{c.complaint_date}</td>
                                        <td><PriorityBadge priority={c.priority} /></td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td>
                                            <Link to={`/officer/complaints/${c.complaint_id}`} className="btn btn-primary btn-sm">
                                                <Eye size={14} /> Handle
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

export default AssignedComplaints;
