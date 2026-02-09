import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const JobSeekerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('jobs/');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !selectedCategory ||
            job.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            (job.description && job.description.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container dashboard-container">
            {/* Welcome Header */}
            <div className="section-header" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #fff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f0f0',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#666'
                    }}>
                        {user?.profile_picture ? (
                            <img src={`http://localhost:8000${user.profile_picture}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>
                            Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                            Discover your next career opportunity
                        </p>
                    </div>
                </div>
                <Link to="/profile">
                    <Button variant="outline" size="small" style={{ color: '#fff', borderColor: '#fa82a7' }}>
                        View Profile
                    </Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="hero-search" style={{ maxWidth: '100%', marginBottom: '30px', marginTop: 0 }}>
                <input
                    placeholder="Search jobs by title, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary">Search</button>
            </div>

            {/* Browse by Category - Horizontal Scroll */}
            <div className="categories-scroll-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Browse by Category</h4>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory('')}
                            style={{
                                background: '#fa82a7',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
                <div className="categories-scroll-wrapper">
                    {[
                        { title: 'Technology' },
                        { title: 'Business' },
                        { title: 'Design' },
                        { title: 'Marketing' },
                        { title: 'Healthcare' },
                        { title: 'Education' },
                        { title: 'Legal' },
                        { title: 'Engineering' },
                    ].map((cat, index) => (
                        <div
                            key={index}
                            className="category-scroll-card"
                            onClick={() => setSelectedCategory(selectedCategory === cat.title ? '' : cat.title)}
                            style={{
                                border: selectedCategory === cat.title ? '2px solid #fa82a7' : '2px solid transparent',
                                background: selectedCategory === cat.title ? '#fff0f5' : '#f9ebdf'
                            }}
                        >
                            <h5>{cat.title}</h5>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jobs Count */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>
                    Available Jobs <span className="badge" style={{ background: '#fa82a7', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', marginLeft: '10px' }}>{filteredJobs.length}</span>
                </h3>
            </div>

            {/* Job Grid */}
            <div className="job-grid">
                {filteredJobs.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                        <p style={{ color: '#fff', fontSize: '18px' }}>No jobs found matching your search.</p>
                        <p style={{ color: 'var(--text-muted)' }}>Try different keywords or browse all jobs.</p>
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job.id} className="job-card-enhanced">
                            {/* Company Logo Placeholder */}
                            <div className="job-company-logo">
                                {job.recruiter_email?.charAt(0).toUpperCase() || 'C'}
                            </div>

                            <div className="job-header" style={{ marginBottom: '12px' }}>
                                <h3 style={{ color: '#000', margin: 0, fontSize: '18px' }}>{job.title}</h3>
                            </div>

                            <span className="job-type-badge" style={{ background: '#fa82a7', color: '#fff', marginBottom: '12px', display: 'inline-block' }}>
                                Full Time
                            </span>

                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                                Location: {job.location}
                            </p>
                            <p style={{ color: '#000', fontWeight: '600', fontSize: '16px', marginBottom: '12px' }}>
                                Salary: {job.salary_range}
                            </p>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
                                {job.description.substring(0, 80)}...
                            </p>

                            <div style={{ marginTop: 'auto' }}>
                                <Link to={`/apply/${job.id}`}>
                                    <Button variant="primary" size="small" style={{ width: '100%', border: 'none' }}>
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;

