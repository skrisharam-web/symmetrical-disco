import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const HRDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('jobs/'),
                api.get('applications/')
            ]);
            const myJobs = jobsRes.data.filter(job => job.recruiter === user.id);
            setJobs(myJobs);

            // Filter applications for my jobs
            const myJobIds = myJobs.map(j => j.id);
            const myApps = appsRes.data.filter(app => myJobIds.includes(app.job));
            setApplications(myApps);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalApplications = applications.length;
    const reviewedCount = applications.filter(a => a.status === 'REVIEWED').length;
    const hiredCount = applications.filter(a => a.status === 'HIRED').length;

    const deleteJob = async (id) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await api.delete(`jobs/${id}/`);
            fetchJobs();
        } catch (err) {
            alert("Failed to delete");
        }
    }

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container dashboard-container">
            {/* Welcome Header */}
            <div className="section-header" style={{ marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>
                        Recruiter Dashboard
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        Manage your job postings and applications
                    </p>
                </div>
                <Link to="/post-job">
                    <Button variant="primary" size="medium" style={{ border: 'none' }}>
                        + Post New Job
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="quick-stat-card">
                    <div className="number">{jobs.length}</div>
                    <div className="label">Active Jobs</div>
                </div>
                <div className="quick-stat-card">
                    <div className="number">{totalApplications}</div>
                    <div className="label">Total Applications</div>
                </div>
                <div className="quick-stat-card">
                    <div className="number">{reviewedCount}</div>
                    <div className="label">Reviewed</div>
                </div>
                <div className="quick-stat-card">
                    <div className="number">{hiredCount}</div>
                    <div className="label">Hired</div>
                </div>
            </div>

            {/* Jobs Section */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>
                    Your Posted Jobs <span className="badge" style={{ background: '#fa82a7', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', marginLeft: '10px' }}>{jobs.length}</span>
                </h3>
            </div>

            <div className="job-grid">
                {jobs.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#f9ebdf', borderRadius: '12px' }}>
                        <p style={{ color: '#000', fontSize: '18px', marginBottom: '10px' }}>No jobs posted yet</p>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Start by posting your first job opening</p>
                        <Link to="/post-job">
                            <Button variant="primary" style={{ border: 'none' }}>Post Your First Job</Button>
                        </Link>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="job-card-enhanced">
                            <div className="job-company-logo">
                                {job.title?.charAt(0).toUpperCase() || 'J'}
                            </div>

                            <h3 style={{ color: '#000', margin: '0 0 8px 0', fontSize: '18px' }}>{job.title}</h3>

                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                                Location: {job.location}
                            </p>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                                Posted: {new Date(job.created_at).toLocaleDateString()}
                            </p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <Link to={`/applications/${job.id}`} style={{ flex: 1 }}>
                                    <Button variant="primary" size="small" style={{ width: '100%', border: 'none' }}>
                                        View Apps
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => deleteJob(job.id)}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'transparent',
                                        border: '2px solid #dc3545',
                                        color: '#dc3545',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HRDashboard;

