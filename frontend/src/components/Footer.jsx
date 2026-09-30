import React from 'react';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved.</p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', opacity: 0.8 }}>
                    Academic Project - Civic Complaint Management and Public Service System
                </p>
            </div>
        </footer>
    );
};

export default Footer;
