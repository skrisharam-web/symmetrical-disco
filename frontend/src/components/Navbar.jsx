import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="brand">DREAMSCOMETRUE</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            {user.role === 'HR' ? (
                                <Link to="/hr-dashboard" className="btn btn-primary btn-small">HR Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="nav-item">Find Jobs</Link>
                                    <Link to="/profile" className="nav-item">Profile</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline btn-small">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary btn-small">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-small">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
