import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        deadline: '',
    });
    const [questions, setQuestions] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setQuestions([...questions, { id: `q${Date.now()}`, text: '', type: 'text', required: true }]);
    };

    const updateQuestion = (index, field, value) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.location || !formData.description || !formData.deadline) {
            showToast("Please fill in all required fields");
            return;
        }
        const payload = {
            ...formData,
            requirements_schema: {
                questions: questions,
                attachment_required: true
            }
        };
        try {
            await api.post('jobs/', payload);
            showToast("Job posted successfully!", 'success');
            setTimeout(() => navigate('/hr-dashboard'), 1500);
        } catch (err) {
            console.error(err);
            showToast("Failed to post job. Please try again.");
        }
    };

    // Styles
    const pageStyle = {
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, #020c1b 0%, #0a192f 100%)',
    };

    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
    };

    const cardStyle = {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '40px',
        paddingBottom: '30px',
        borderBottom: '2px solid #f0f0f0',
    };

    const inputStyle = {
        width: '100%',
        padding: '16px 20px',
        border: '2px solid #e8e8e8',
        borderRadius: '14px',
        fontSize: '15px',
        color: '#333',
        background: '#fafafa',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '10px',
    };

    const buttonPrimaryStyle = {
        background: 'linear-gradient(135deg, #fa82a7 0%, #ff6b9d 100%)',
        color: '#fff',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 25px rgba(250, 130, 167, 0.35)',
        width: '100%',
    };

    const buttonSecondaryStyle = {
        background: 'transparent',
        color: '#fa82a7',
        border: '2px dashed #fa82a7',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const sectionStyle = {
        marginBottom: '32px',
    };

    const formRowStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    };

    const questionCardStyle = {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '1px solid #e0e0e0',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '16px',
        transition: 'all 0.3s ease',
    };

    const toastStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        background: toast.type === 'success'
            ? 'linear-gradient(135deg, #00c853 0%, #00e676 100%)'
            : 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
    };

    return (
        <div style={pageStyle}>
            {/* Toast Notification */}
            {toast.show && (
                <div style={toastStyle}>
                    {toast.message}
                </div>
            )}

            <div style={containerStyle}>
                <div style={cardStyle}>
                    {/* Header */}
                    <div style={headerStyle}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        }}>
                            <span style={{ fontSize: '32px', color: '#fff' }}>+</span>
                        </div>
                        <h1 style={{
                            margin: '0 0 10px 0',
                            color: '#1a1a2e',
                            fontSize: '32px',
                            fontWeight: '700',
                        }}>Post a New Job</h1>
                        <p style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '16px',
                            maxWidth: '400px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}>Create a compelling job listing to attract the best talent</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Basic Info Section */}
                        <div style={sectionStyle}>
                            <h3 style={{
                                color: '#1a1a2e',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{
                                    background: '#f0e6ff',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}>1</span>
                                Basic Information
                            </h3>
                            <div style={formRowStyle}>
                                <div>
                                    <label style={labelStyle}>Job Title *</label>
                                    <input
                                        name="title"
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Software Engineer"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Location *</label>
                                    <input
                                        name="location"
                                        onChange={handleChange}
                                        placeholder="e.g. San Francisco, CA (Remote)"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Job Description *</label>
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                    rows={6}
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }}
                                />
                            </div>
                            <div style={formRowStyle}>
                                <div>
                                    <label style={labelStyle}>Salary Range (Optional)</label>
                                    <input
                                        name="salary_range"
                                        onChange={handleChange}
                                        placeholder="e.g. $120,000 - $180,000 / year"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Application Deadline *</label>
                                    <input
                                        name="deadline"
                                        type="datetime-local"
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Custom Questions Section */}
                        <div style={{
                            ...sectionStyle,
                            background: '#fafafa',
                            margin: '0 -40px',
                            padding: '32px 40px',
                            borderTop: '1px solid #eee',
                            borderBottom: '1px solid #eee',
                        }}>
                            <h3 style={{
                                color: '#1a1a2e',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{
                                    background: '#e6fff0',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#00c853'
                                }}>2</span>
                                Custom Application Questions
                            </h3>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
                                Add screening questions that applicants must answer when applying
                            </p>

                            {questions.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    background: '#fff',
                                    borderRadius: '14px',
                                    border: '2px dashed #ddd',
                                    marginBottom: '20px',
                                }}>
                                    <p style={{ color: '#888', margin: '0 0 16px 0' }}>No custom questions added yet</p>
                                    <button type="button" onClick={addQuestion} style={buttonSecondaryStyle}>
                                        + Add Your First Question
                                    </button>
                                </div>
                            )}

                            {questions.map((q, idx) => (
                                <div key={q.id} style={questionCardStyle}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <span style={{
                                            background: '#fa82a7',
                                            color: '#fff',
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            flexShrink: 0,
                                        }}>
                                            {idx + 1}
                                        </span>
                                        <input
                                            placeholder="Enter your question here..."
                                            value={q.text}
                                            onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
                                            style={{ ...inputStyle, flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(idx)}
                                            style={{
                                                background: '#ff6b6b',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {questions.length > 0 && (
                                <button type="button" onClick={addQuestion} style={buttonSecondaryStyle}>
                                    + Add Another Question
                                </button>
                            )}
                        </div>

                        {/* Submit Section */}
                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button type="submit" style={buttonPrimaryStyle}>
                                Publish Job Listing
                            </button>
                            <p style={{ color: '#888', fontSize: '13px', marginTop: '16px' }}>
                                Your job will be visible to candidates immediately after publishing
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                input:focus, textarea:focus {
                    border-color: #fa82a7 !important;
                    box-shadow: 0 0 0 4px rgba(250, 130, 167, 0.15) !important;
                    background: #fff !important;
                }
            `}</style>
        </div>
    );
};

export default PostJob;
