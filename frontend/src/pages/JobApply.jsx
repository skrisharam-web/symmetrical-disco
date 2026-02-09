import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const JobApply = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`jobs/${id}/`);
                setJob(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleResponseChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('applications/', {
                job: id,
                responses: responses
            });
            alert("Application Submitted Successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to submit application. Ensure all fields are filled.");
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!job) return <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>Job not found</div>;

    const questions = job.requirements_schema?.questions || [];

    return (
        <div className="container dashboard-container">
            <div className="section-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ color: '#000', margin: '0 0 8px 0' }}>📋 Apply for {job.title}</h2>

                {/* Job Details */}
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>
                        📍 {job.location} &nbsp;•&nbsp; 💰 {job.salary_range}
                    </p>
                    <p style={{ color: '#333', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{job.description}</p>
                </div>


                <form onSubmit={handleSubmit}>
                    {questions.length > 0 && <h3 style={{ color: '#000000' }}>Answer the below questions</h3>}

                    {questions.map(q => (
                        <div key={q.id} className="form-group">
                            <label style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>{q.text} {q.required && '*'}</label>
                            <input
                                required={q.required}
                                onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                style={{ color: '#000000', background: '#ffffff' }}
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary full-width" style={{ border: 'none' }}>Submit Application</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-primary btn-small full-width" style={{ marginTop: 10, border: 'none' }}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default JobApply;
