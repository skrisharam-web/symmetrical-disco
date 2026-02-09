import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('applications/');
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'HIRED': return { bg: '#d4edda', color: '#155724' };
            case 'REJECTED': return { bg: '#f8d7da', color: '#721c24' };
            case 'REVIEWED': return { bg: '#fff3cd', color: '#856404' };
            default: return { bg: '#e2e3e5', color: '#383d41' };
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container dashboard-container">
            {/* Header */}
            <div className="section-header" style={{ marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>My Applications 📋</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        Track the status of your job applications
                    </p>
                </div>
                <Link to="/dashboard">
                    <button className="btn btn-primary" style={{ border: 'none' }}>Browse Jobs</button>
                </Link>
            </div>

            {/* Applications Grid */}
            <div className="job-grid">
                {applications.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#f9ebdf', borderRadius: '12px' }}>
                        <p style={{ color: '#000', fontSize: '18px', marginBottom: '10px' }}>No applications yet</p>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Start applying to jobs to track your progress here</p>
                        <Link to="/dashboard">
                            <button className="btn btn-primary" style={{ border: 'none' }}>Find Jobs</button>
                        </Link>
                    </div>
                ) : (
                    applications.map(app => {
                        const statusStyle = getStatusColor(app.status);
                        return (
                            <div key={app.id} className="job-card-enhanced">
                                <div className="job-company-logo">
                                    {app.job_title?.charAt(0).toUpperCase() || 'J'}
                                </div>
                                <h3 style={{ color: '#000', margin: '0 0 12px 0', fontSize: '18px' }}>{app.job_title}</h3>
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                                    📅 Applied: {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                                </p>
                                <div style={{ marginTop: 'auto' }}>
                                    <span style={{
                                        background: statusStyle.bg,
                                        color: statusStyle.color,
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyApplications;

