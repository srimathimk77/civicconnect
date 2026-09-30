import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, UserPlus, ShieldAlert, CheckCircle, Power } from 'lucide-react';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filterRole, setFilterRole] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal state for Add Officer
    const [showModal, setShowModal] = useState(false);
    const [officerForm, setOfficerForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: 'officer123',
        department_id: '',
        address: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loadData = async () => {
        try {
            const u = await api.getAdminUsers();
            const d = await api.getAdminDepartments();
            setUsers(u);
            setDepartments(d);
            if (d.length > 0) {
                setOfficerForm(prev => ({ ...prev, department_id: d[0].department_id }));
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

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.toggleUserStatus(id);
            setSuccessMsg(res.message);
            loadData();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to update user status.');
        }
    };

    const handleAddOfficer = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await api.addOfficer(officerForm);
            setSuccessMsg('Government Officer account created successfully!');
            setShowModal(false);
            setOfficerForm({ name: '', email: '', phone: '', password: 'officer123', department_id: departments[0]?.department_id || '', address: '' });
            loadData();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to create officer account.');
        }
    };

    const filteredUsers = users.filter(u => filterRole === '' || u.role === filterRole);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">View citizens & department officers, create officers, activate/deactivate accounts</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <UserPlus size={18} /> Add Department Officer
                </button>
            </div>

            {successMsg && <div className="alert alert-success"><CheckCircle size={18} /> {successMsg}</div>}
            {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

            <div className="filter-bar">
                <span style={{ fontWeight: 600, color: '#475569' }}>Filter by User Role:</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setFilterRole('')} className={`btn btn-sm ${filterRole === '' ? 'btn-primary' : 'btn-outline'}`}>
                        All Users
                    </button>
                    <button onClick={() => setFilterRole('CITIZEN')} className={`btn btn-sm ${filterRole === 'CITIZEN' ? 'btn-primary' : 'btn-outline'}`}>
                        Citizens
                    </button>
                    <button onClick={() => setFilterRole('OFFICER')} className={`btn btn-sm ${filterRole === 'OFFICER' ? 'btn-primary' : 'btn-outline'}`}>
                        Department Officers
                    </button>
                    <button onClick={() => setFilterRole('ADMIN')} className={`btn btn-sm ${filterRole === 'ADMIN' ? 'btn-primary' : 'btn-outline'}`}>
                        Admins
                    </button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading users list...</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.user_id}>
                                        <td>#{u.user_id}</td>
                                        <td style={{ fontWeight: 700 }}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td><span className={`role-pill role-${u.role}`}>{u.role}</span></td>
                                        <td>{u.department_name || '-'}</td>
                                        <td>
                                            {u.is_active === 1 ? (
                                                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>Active</span>
                                            ) : (
                                                <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>Deactivated</span>
                                            )}
                                        </td>
                                        <td>
                                            {u.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleToggleStatus(u.user_id)}
                                                    className={`btn btn-sm ${u.is_active === 1 ? 'btn-danger' : 'btn-success'}`}
                                                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                                >
                                                    <Power size={13} /> {u.is_active === 1 ? 'Deactivate' : 'Activate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Officer Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Add Government Department Officer</h3>
                            <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">X</button>
                        </div>
                        <form onSubmit={handleAddOfficer}>
                            <div className="form-group">
                                <label className="form-label">Officer Full Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={officerForm.name}
                                    onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={officerForm.email}
                                        onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={officerForm.phone}
                                        onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Assign Department *</label>
                                    <select
                                        className="form-select"
                                        value={officerForm.department_id}
                                        onChange={(e) => setOfficerForm({ ...officerForm, department_id: e.target.value })}
                                        required
                                    >
                                        {departments.map((d) => (
                                            <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={officerForm.password}
                                        onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Officer Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
