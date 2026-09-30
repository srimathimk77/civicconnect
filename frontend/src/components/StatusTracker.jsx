import React from 'react';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

export const StatusTracker = ({ currentStatus }) => {
    const isRejected = currentStatus === 'Rejected';

    const steps = [
        { key: 'Submitted', label: '1. Submitted' },
        { key: 'Assigned', label: '2. Assigned' },
        { key: 'In Progress', label: '3. In Progress' },
        { key: 'Resolved', label: '4. Resolved' }
    ];

    const getStepState = (stepKey) => {
        if (isRejected) {
            if (stepKey === 'Submitted') return 'completed';
            return 'rejected';
        }

        const statusOrder = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepKey);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    return (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                Complaint Progress Lifecycle
            </h4>

            {isRejected ? (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <XCircle size={24} />
                    <div>
                        <strong>Status: REJECTED</strong>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>This complaint was reviewed and rejected by the officer/department.</p>
                    </div>
                </div>
            ) : (
                <div className="tracker-timeline">
                    {steps.map((step) => {
                        const state = getStepState(step.key);
                        return (
                            <div key={step.key} className={`tracker-step ${state}`}>
                                <div className="step-node">
                                    {state === 'completed' && <Check size={20} />}
                                    {state === 'active' && <Clock size={20} />}
                                    {state === 'pending' && <AlertCircle size={18} />}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatusTracker;
