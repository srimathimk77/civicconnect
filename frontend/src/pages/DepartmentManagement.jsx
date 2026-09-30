import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Building, Plus, Edit, CheckCircle, ShieldAlert } from 'lucide-react';

export const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [deptForm, setDeptForm] = useState({ department_name: '', description: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const loadDepartments = async () => {
        try {
            const data = await api.getAdminDepartments();
            setDepartments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleOpenAdd = () => {
        setEditingDept(null);
        setDeptForm({ department_name: '', description: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (dept) => {
        setEditingDept(dept);
        setDeptForm({ department_name: dept.department_name, description: dept.description || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        try {
            if (editingDept) {
                await api.updateDepartment(editingDept.department_id, deptForm);
                setSuccessMsg(`Department "${deptForm.department_name}" updated successfully!`);
            } else {
                await api.addDepartment(deptForm);
                setSuccessMsg(`Department "${deptForm.department_name}" created successfully!`);
            }
            setShowModal(false);
            loadDepartments();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to save department.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Department Management</h1>
                    <p className="page-subtitle">Configure municipal government departments and officer assignments</p>
                </div>
                <button onClick={handleOpenAdd} className="btn btn-primary">
                    <Plus size={18} /> Add New Department
                </button>
            </div>

            {successMsg && <div className="alert alert-success"><CheckCircle size={18} /> {successMsg}</div>}
            {errorMsg && <div className="alert alert-error"><ShieldAlert size={18} /> {errorMsg}</div>}

            <div className="card">
                {loading ? (
                    <p style={{ color: '#64748b' }}>Loading departments...</p>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Department Name</th>
                                    <th>Description</th>
                                    <th>Assigned Officers</th>
                                    <th>Total Complaints</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((d) => (
                                    <tr key={d.department_id}>
                                        <td>#{d.department_id}</td>
                                        <td style={{ fontWeight: 700, color: '#1e293b' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Building size={16} color="#2563eb" />
                                                {d.department_name}
                                            </div>
                                        </td>
                                        <td>{d.description || 'No description provided'}</td>
                                        <td>
                                            <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                                                {d.officer_count} Officers
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                                                {d.complaint_count} Complaints
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleOpenEdit(d)} className="btn btn-outline btn-sm">
                                                <Edit size={14} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingDept ? 'Edit Department' : 'Add New Department'}</h3>
                            <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">X</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Department Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Roads Department"
                                    value={deptForm.department_name}
                                    onChange={(e) => setDeptForm({ ...deptForm, department_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description / Scope of Work</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Specify responsibilities e.g. road repairs, pothole filling..."
                                    value={deptForm.description}
                                    onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingDept ? 'Save Changes' : 'Create Department'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;
