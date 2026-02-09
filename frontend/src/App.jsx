import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Home from './components/Home';
import HRDashboard from './pages/HRDashboard';
import PostJob from './pages/PostJob';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import JobApply from './pages/JobApply';
import Profile from './pages/Profile';
import ViewApplications from './pages/ViewApplications';
import MyApplications from './pages/MyApplications';
import { useAuth } from './context/AuthContext';

// Placeholders removed

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute role="SEEKER"><JobSeekerDashboard /></ProtectedRoute>
        } />
        <Route path="/hr-dashboard" element={
          <ProtectedRoute role="HR"><HRDashboard /></ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute role="HR"><PostJob /></ProtectedRoute>
        } />
        <Route path="/applications/:id" element={
          <ProtectedRoute role="HR"><ViewApplications /></ProtectedRoute>
        } />
        <Route path="/apply/:id" element={
          <ProtectedRoute role="SEEKER"><JobApply /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute role="SEEKER"><Profile /></ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute role="SEEKER"><MyApplications /></ProtectedRoute>
        } />

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
