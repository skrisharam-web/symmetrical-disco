import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('SEEKER'); // Default to Job Seeker
    const { login, logout } = useAuth(); // Destructure logout
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const userData = await login(email, password);

            // ---------------------------------------------------------
            // ROLE VERIFICATION
            // ---------------------------------------------------------
            if (userData.role !== role) {
                setError(`Access denied: You are not a ${role === 'HR' ? 'Recruiter' : 'Job Seeker'}`);
                logout(); // Log them out immediately if role mismatch
                return;
            }

            // Navigate based on role (or just home if structure differs)
            if (userData.role === 'HR') {
                navigate('/hr-dashboard');
            } else {
                navigate('/dashboard'); // Job Seeker Dashboard or Home
            }

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Invalid credentials or login failed');
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <Card className="auth-card" style={{ background: '#f9ebdf', maxWidth: '420px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#000000', fontSize: '28px' }}>
                    {role === 'HR' ? 'Recruiter Login' : 'Job Seeker Login'}
                </h2>

                {/* Role Selection UI */}
                {/* Role Toggle Switch */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                    <div style={{
                        display: 'flex',
                        background: '#e0e0e0',
                        borderRadius: '30px',
                        padding: '4px',
                        width: '280px'
                    }}>
                        <button
                            type="button"
                            onClick={() => setRole('SEEKER')}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '26px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                background: role === 'SEEKER' ? '#fa82a7' : 'transparent',
                                color: role === 'SEEKER' ? '#fff' : '#666'
                            }}
                        >
                            Job Seeker
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('HR')}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '26px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                background: role === 'HR' ? '#fa82a7' : 'transparent',
                                color: role === 'HR' ? '#fff' : '#666'
                            }}
                        >
                            Recruiter
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '15px' }}>Sign in to continue to your account</p>
                {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '20px', color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '8px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email ID"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                    <Button type="submit" variant="primary" className="full-width" style={{ width: '100%', marginTop: '10px' }}>
                        Login
                    </Button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#333' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#fa82a7', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;
