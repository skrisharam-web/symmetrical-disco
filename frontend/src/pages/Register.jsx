import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'SEEKER'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="auth-wrapper">
            <Card className="auth-card" style={{ background: '#f9ebdf', maxWidth: '480px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#000000', fontSize: '28px' }}>Create Account</h2>
                <p style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '15px' }}>Join thousands of professionals finding their dream jobs</p>
                {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '20px', color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '8px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <Input
                            label="First Name"
                            name="first_name"
                            onChange={handleChange}
                            required
                            style={{ flex: 1 }}
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            onChange={handleChange}
                            required
                            style={{ flex: 1 }}
                        />
                    </div>
                    <Input
                        label="Email ID"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        required
                    />
                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            value={formData.role}
                            className="form-input"
                        >
                            <option value="SEEKER">Job Seeker</option>
                            <option value="HR">Recruiter</option>
                        </select>
                    </div>
                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }}>
                        Register Now
                    </Button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#333' }}>
                    Already have an account? <Link to="/login" style={{ color: '#fa82a7', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
