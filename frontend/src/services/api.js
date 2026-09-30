const API_BASE = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('civic_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res, defaultErrMsg = 'Request failed') => {
    let data = {};
    try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error('Unable to connect to backend server. Please verify the backend is running on port 5000.');
    }
    if (!res.ok) {
        throw new Error(data.message || defaultErrMsg);
    }
    return data;
};

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(res, 'Login failed');
    },

    register: async (userData) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return handleResponse(res, 'Registration failed');
    },

    // Public
    getPublicStats: async () => {
        const res = await fetch(`${API_BASE}/public/stats`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
        return data;
    },

    getPublicDepartments: async () => {
        const res = await fetch(`${API_BASE}/public/departments`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch departments');
        return data;
    },

    // Citizen APIs
    getCitizenProfile: async () => {
        const res = await fetch(`${API_BASE}/citizens/profile`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    },

    updateCitizenProfile: async (profileData) => {
        const res = await fetch(`${API_BASE}/citizens/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(profileData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update profile');
        return data;
    },

    submitComplaint: async (formData) => {
        const res = await fetch(`${API_BASE}/citizens/complaints`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit complaint');
        return data;
    },

    getMyComplaints: async () => {
        const res = await fetch(`${API_BASE}/citizens/complaints/my`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
        return data;
    },

    getComplaintById: async (id) => {
        const res = await fetch(`${API_BASE}/citizens/complaints/${id}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch complaint details');
        return data;
    },

    getNotifications: async () => {
        const res = await fetch(`${API_BASE}/citizens/notifications`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
        return data;
    },

    markNotificationRead: async (id) => {
        const res = await fetch(`${API_BASE}/citizens/notifications/${id}/read`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update notification');
        return data;
    },

    submitFeedback: async (feedbackData) => {
        const res = await fetch(`${API_BASE}/citizens/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(feedbackData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');
        return data;
    },

    // Officer APIs
    getOfficerProfile: async () => {
        const res = await fetch(`${API_BASE}/officer/profile`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch officer profile');
        return data;
    },

    getOfficerComplaints: async (params = {}) => {
        const queryStr = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/officer/complaints?${queryStr}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch officer complaints');
        return data;
    },

    getOfficerComplaintDetails: async (id) => {
        const res = await fetch(`${API_BASE}/officer/complaints/${id}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch complaint details');
        return data;
    },

    updateComplaintStatus: async (id, statusData) => {
        const res = await fetch(`${API_BASE}/officer/complaints/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(statusData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update status');
        return data;
    },

    // Admin APIs
    getAdminUsers: async () => {
        const res = await fetch(`${API_BASE}/admin/users`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        return data;
    },

    addOfficer: async (officerData) => {
        const res = await fetch(`${API_BASE}/admin/users/officer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(officerData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add officer');
        return data;
    },

    toggleUserStatus: async (id) => {
        const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to toggle user status');
        return data;
    },

    getAdminDepartments: async () => {
        const res = await fetch(`${API_BASE}/admin/departments`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch departments');
        return data;
    },

    addDepartment: async (deptData) => {
        const res = await fetch(`${API_BASE}/admin/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(deptData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add department');
        return data;
    },

    updateDepartment: async (id, deptData) => {
        const res = await fetch(`${API_BASE}/admin/departments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(deptData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update department');
        return data;
    },

    getAdminComplaints: async (params = {}) => {
        const queryStr = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/admin/complaints?${queryStr}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
        return data;
    },

    assignComplaint: async (id, assignData) => {
        const res = await fetch(`${API_BASE}/admin/complaints/${id}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(assignData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to assign complaint');
        return data;
    },

    getAdminFeedback: async () => {
        const res = await fetch(`${API_BASE}/admin/feedback`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch feedback list');
        return data;
    },

    getAdminReports: async () => {
        const res = await fetch(`${API_BASE}/admin/reports`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch report data');
        return data;
    }
};
