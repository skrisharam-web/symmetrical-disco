import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Home = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // Check if user is HR to redirect to HR dashboard
    if (user && user.role === 'HR') {
        return <Navigate to="/hr-dashboard" replace />;
    }

    // Check if user is Seeker to redirect to Seeker dashboard
    if (user && user.role === 'SEEKER') {
        return <Navigate to="/dashboard" replace />;
    }

    const steps = [
        { icon: '', title: 'Create An Account', desc: "It's very easy to open an account and start your journey." },
        { icon: '', title: 'Complete Your Profile', desc: 'Share all the key details so employers can get to know you.' },
        { icon: '', title: 'Apply Job or Hire', desc: 'Apply to your preferred jobs or hire top talent effortlessly.' },
    ];

    // Landing Page for non-authenticated users
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Your Next Big <br />
                        <span style={{ color: '#ffffff' }}>Leap Awaits</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect with top employers and discover opportunities that match your passion and skills.
                    </p>

                    {/* Hero Search Bar */}
                    <div className="hero-search">
                        <input
                            type="text"
                            placeholder="Search jobs by title, company, or location..."
                        />
                        <Link to="/register">
                            <button className="btn btn-primary">Search Jobs</button>
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hero-actions" style={{ marginTop: '30px' }}>
                        <Link to="/register">
                            <Button size="large" variant="primary">Explore Jobs</Button>
                        </Link>
                        <Link to="/login">
                            <Button size="large" variant="outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#ffffff' }}>
                                Post a Job
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stat-item">
                    <span className="stat-number">10,000+</span>
                    <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">5,000+</span>
                    <span className="stat-label">Companies</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">1M+</span>
                    <span className="stat-label">Job Seekers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">500K+</span>
                    <span className="stat-label">Successful Hires</span>
                </div>
            </div>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <p style={{ textAlign: 'center', color: '#fa82a7', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        Simple Steps
                    </p>
                    <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '50px', fontSize: '32px' }}>
                        How It Works
                    </h2>
                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-icon">{step.icon}</div>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
