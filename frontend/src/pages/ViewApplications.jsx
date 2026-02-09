import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const ViewApplications = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [resumeModal, setResumeModal] = useState({ show: false, url: '' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [appRes, jobRes] = await Promise.all([
                api.get(`applications/?job=${id}`),
                api.get(`jobs/${id}/`)
            ]);
            setApplications(appRes.data);
            setJob(jobRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.post(`applications/${appId}/update_status/`, { status });
            const res = await api.get(`applications/?job=${id}`);
            setApplications(res.data);
            showToast(`Status updated to ${status}`, 'success');
        } catch (err) {
            showToast("Failed to update status");
        }
    };

    const renderResponses = (responses) => {
        if (!job?.requirements_schema?.questions) {
            return <pre style={{ background: '#f4f4f4', padding: 10, borderRadius: 8 }}>{JSON.stringify(responses, null, 2)}</pre>;
        }

        return job.requirements_schema.questions.map(q => {
            const answer = responses[q.id];
            if (answer === undefined || answer === null) return null;

            return (
                <div key={q.id} style={{ marginBottom: 16 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', margin: '0 0 6px 0', color: '#555' }}>
                        {q.text}
                    </p>
                    <div style={{
                        background: '#ffffff',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                        fontSize: '15px',
                        color: '#333'
                    }}>
                        {answer}
                    </div>
                </div>
            );
        });
    };

    const handleDownloadResume = async (appId, resumeUrl) => {
        try {
            const response = await api.get(`applications/${appId}/download_resume/`, {
                responseType: 'blob',
            });
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'resume.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch?.length === 2) filename = filenameMatch[1];
            } else {
                filename = resumeUrl.split('/').pop();
            }
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            showToast("Failed to download resume");
        }
    };

    const handleViewResume = async (appId) => {
        try {
            const response = await api.get(`applications/${appId}/view_resume/`, {
                responseType: 'blob',
            });
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);
            setResumeModal({ show: true, url: fileURL });
        } catch (error) {
            console.error("View failed", error);
            showToast("Failed to view resume");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'HIRED': return { bg: 'linear-gradient(135deg, #00c853 0%, #00e676 100%)', color: '#fff' };
            case 'REJECTED': return { bg: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)', color: '#fff' };
            case 'REVIEWED': return { bg: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)', color: '#fff' };
            default: return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' };
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;

    // Styles
    const pageStyle = {
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, #020c1b 0%, #0a192f 100%)',
    };

    const headerCardStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '30px',
        color: '#fff',
    };

    const applicationCardStyle = {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
    };

    const buttonStyle = {
        background: 'linear-gradient(135deg, #fa82a7 0%, #ff6b9d 100%)',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const selectStyle = {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '2px solid #e0e0e0',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        outline: 'none',
        background: '#fafafa',
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

    const sectionStyle = {
        background: '#f8f9fa',
        borderRadius: '14px',
        padding: '20px',
        marginTop: '20px',
    };

    const skillTagStyle = {
        background: 'linear-gradient(135deg, #fa82a7 0%, #ff6b9d 100%)',
        color: '#fff',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
    };

    return (
        <div style={pageStyle}>
            {/* Toast Notification */}
            {toast.show && (
                <div style={toastStyle}>
                    {toast.message}
                </div>
            )}

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={headerCardStyle}>
                    <Link to="/hr-dashboard" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        ← Back to Dashboard
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
                                Applications for {job?.title}
                            </h1>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
                                {job?.location} • Posted {new Date(job?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <span style={{ fontSize: '28px', fontWeight: '700' }}>{applications.length}</span>
                            <span style={{ fontSize: '15px', marginLeft: '8px' }}>Applications</span>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div style={{ ...applicationCardStyle, textAlign: 'center', padding: '60px' }}>
                        <p style={{ fontSize: '18px', color: '#666' }}>No applications yet. Check back later!</p>
                    </div>
                ) : (
                    applications.map(app => {
                        const statusStyle = getStatusStyle(app.status);
                        return (
                            <div key={app.id} style={applicationCardStyle} className="glow-card">
                                {/* Applicant Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '22px',
                                            fontWeight: '600',
                                            overflow: 'hidden',
                                            border: '2px solid #fff',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}>
                                            {app.applicant_details?.profile_picture ? (
                                                <img
                                                    src={`http://localhost:8000${app.applicant_details.profile_picture}`}
                                                    alt="Profile"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                app.applicant_email?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 4px 0', color: '#1a1a2e', fontSize: '18px', fontWeight: '600' }}>
                                                {app.applicant_email}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    padding: '4px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                }}>
                                                    {app.status}
                                                </span>
                                                <span style={{ color: '#888', fontSize: '13px' }}>
                                                    Applied {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="REVIEWED">Reviewed</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="HIRED">Hired</option>
                                    </select>
                                </div>

                                {/* Resume Buttons */}
                                {app.resume_url && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                                        <button onClick={() => handleViewResume(app.id)} style={buttonStyle}>
                                            View Resume
                                        </button>
                                        <button
                                            onClick={() => handleDownloadResume(app.id, app.resume_url)}
                                            style={{ ...buttonStyle, background: 'linear-gradient(135deg, #333 0%, #555 100%)' }}
                                        >
                                            Download Resume
                                        </button>
                                    </div>
                                )}

                                {/* Responses Section */}
                                {job?.requirements_schema?.questions?.length > 0 && (
                                    <div style={sectionStyle}>
                                        <h4 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>
                                            Screening Responses
                                        </h4>
                                        {renderResponses(app.responses)}
                                    </div>
                                )}

                                {/* Applicant Profile Details */}
                                {app.applicant_details && (
                                    <div style={{ ...sectionStyle, background: '#fff', border: '1px solid #eee' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>
                                            Applicant Profile
                                        </h4>

                                        {/* Skills */}
                                        {app.applicant_details.skills?.length > 0 && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '10px', textTransform: 'uppercase' }}>Skills</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {app.applicant_details.skills.map((skill, i) => (
                                                        <span key={i} style={skillTagStyle}>{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Experience */}
                                        {app.applicant_details.experience?.length > 0 && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '10px', textTransform: 'uppercase' }}>Experience</p>
                                                {app.applicant_details.experience.map((exp, i) => (
                                                    <div key={i} style={{ background: '#f8f9fa', padding: '16px', borderRadius: '12px', marginBottom: '10px', border: '1px solid #eee' }}>
                                                        <div style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '15px' }}>{exp.title}</div>
                                                        <div style={{ color: '#fa82a7', fontSize: '14px', marginTop: '2px' }}>{exp.company}</div>
                                                        <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{exp.dates}</div>
                                                        {exp.description && <div style={{ fontSize: '14px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>{exp.description}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Education */}
                                        {app.applicant_details.education?.length > 0 && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '10px', textTransform: 'uppercase' }}>Education</p>
                                                {app.applicant_details.education.map((edu, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fa82a7' }}></span>
                                                        <span style={{ color: '#333', fontSize: '14px' }}>{edu.degree} • {edu.institution} ({edu.year})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Certifications */}
                                        {app.applicant_details.certifications?.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '10px', textTransform: 'uppercase' }}>Certifications</p>
                                                {app.applicant_details.certifications.map((cert, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c853' }}></span>
                                                        <span style={{ color: '#333', fontSize: '14px' }}>{cert.name} • {cert.issuer} ({cert.year})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .glow-card:hover {
                    border-color: #fa82a7 !important;
                    box-shadow: 0 12px 40px rgba(250, 130, 167, 0.15) !important;
                }
            `}</style>

            {/* Resume Modal */}
            {resumeModal.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px'
                }} onClick={() => setResumeModal({ show: false, url: '' })}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '900px',
                        height: '85vh',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Resume</h3>
                            <button
                                onClick={() => setResumeModal({ show: false, url: '' })}
                                style={{
                                    background: '#fa82a7',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Close
                            </button>
                        </div>
                        <iframe
                            src={resumeModal.url}
                            style={{
                                flex: 1,
                                width: '100%',
                                border: 'none'
                            }}
                            title="Resume Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewApplications;
