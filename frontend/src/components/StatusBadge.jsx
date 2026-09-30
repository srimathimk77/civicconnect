import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle, ArrowRightCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
    const formattedStatus = status ? status.replace(/\s+/g, '-') : 'Submitted';

    const getIcon = () => {
        switch (status) {
            case 'Submitted': return <Clock size={12} />;
            case 'Assigned': return <ArrowRightCircle size={12} />;
            case 'In Progress': return <AlertCircle size={12} />;
            case 'Resolved': return <CheckCircle2 size={12} />;
            case 'Rejected': return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    return (
        <span className={`badge badge-${formattedStatus}`}>
            {getIcon()}
            {status}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    const p = priority || 'Medium';
    return (
        <span className={`priority-${p}`}>
            {p}
        </span>
    );
};

export default StatusBadge;
