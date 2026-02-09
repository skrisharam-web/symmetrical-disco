import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [profile, setProfile] = useState({
        skills: [],
        experience: [],
        education: [],
        certifications: []
    });
    const [loading, setLoading] = useState(true);
    const [resume, setResume] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // New Education/Experience/Certification State
    const [newExp, setNewExp] = useState({ title: '', company: '', dates: '', description: '' });
    const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '' });
    const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });

    // Toast notification
    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('profiles/me/profile/');
            setProfile({
                skills: res.data.skills || [],
                experience: res.data.experience || [],
                education: res.data.education || [],
                certifications: res.data.certifications || [],
                resume: res.data.resume,
                profile_picture: res.data.profile_picture
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (resume) {
            formData.append('resume', resume);
            try {
                await api.patch('profiles/me/profile/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("Resume uploaded successfully!", 'success');
                fetchProfile();
            } catch (err) {
                showToast("Upload failed. Please try again.");
            }
        }
    };


    // ... (existing state)

    // ...

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_picture', file);
            try {
                await api.patch('profiles/me/profile/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("Profile picture updated!", 'success');
                fetchProfile();
                if (refreshUser) refreshUser(); // Update global user context
            } catch (err) {
                console.error(err);
                showToast("Failed to upload profile picture.");
            }
        }
    };

    const saveProfile = async (updatedProfile) => {
        try {
            // Exclude file fields - they are sent as URLs from GET and should not be sent back
            const { resume, profile_picture, ...payload } = updatedProfile;
            await api.patch('profiles/me/profile/', payload);
            setProfile(updatedProfile);
            return true;
        } catch (err) {
            console.error(err);
            showToast("Failed to update profile");
            return false;
        }
    };

    // Skills
    const addSkill = async () => {
        if (!newSkill.trim()) {
            showToast("Please enter a skill");
            return;
        }
        const updated = { ...profile, skills: [...profile.skills, newSkill] };
        if (await saveProfile(updated)) {
            setNewSkill('');
            showToast("Skill added!", 'success');
        }
    };
    const removeSkill = async (index) => {
        const updated = { ...profile, skills: profile.skills.filter((_, i) => i !== index) };
        saveProfile(updated);
    };

    // Experience
    const addExperience = async () => {
        if (!newExp.title || !newExp.company || !newExp.dates || !newExp.description) {
            showToast("Please fill in all experience fields");
            return;
        }
        const updated = { ...profile, experience: [...profile.experience, newExp] };
        if (await saveProfile(updated)) {
            setNewExp({ title: '', company: '', dates: '', description: '' });
            showToast("Experience added!", 'success');
        }
    };
    const removeExperience = async (index) => {
        const updated = { ...profile, experience: profile.experience.filter((_, i) => i !== index) };
        saveProfile(updated);
    };

    // Education
    const addEducation = async () => {
        if (!newEdu.degree || !newEdu.institution || !newEdu.year) {
            showToast("Please fill in all education fields");
            return;
        }
        const updated = { ...profile, education: [...profile.education, newEdu] };
        if (await saveProfile(updated)) {
            setNewEdu({ degree: '', institution: '', year: '' });
            showToast("Education added!", 'success');
        }
    };
    const removeEducation = async (index) => {
        const updated = { ...profile, education: profile.education.filter((_, i) => i !== index) };
        saveProfile(updated);
    };

    // Certifications
    const addCertification = async () => {
        if (!newCert.name || !newCert.issuer || !newCert.year) {
            showToast("Please fill in all certification fields");
            return;
        }
        const updated = { ...profile, certifications: [...profile.certifications, newCert] };
        if (await saveProfile(updated)) {
            setNewCert({ name: '', issuer: '', year: '' });
            showToast("Certification added!", 'success');
        }
    };

    const removeCertification = async (index) => {
        const updated = { ...profile, certifications: profile.certifications.filter((_, i) => i !== index) };
        saveProfile(updated);
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;

    // Styles
    const pageStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
    };

    const cardStyle = {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0,0,0,0.04)',
    };

    const sectionTitleStyle = {
        color: '#1a1a2e',
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        border: '2px solid #e8e8e8',
        borderRadius: '12px',
        fontSize: '15px',
        color: '#333',
        background: '#fafafa',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const buttonStyle = {
        background: 'linear-gradient(135deg, #fa82a7 0%, #ff6b9d 100%)',
        color: '#fff',
        border: 'none',
        padding: '14px 28px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(250, 130, 167, 0.3)',
    };

    const removeButtonStyle = {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    };

    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fa82a7 0%, #ff6b9d 100%)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: '500',
        gap: '8px',
    };

    const itemCardStyle = {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        padding: '20px',
        borderRadius: '14px',
        marginBottom: '16px',
        border: '1px solid #eee',
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

    const formRowStyle = {
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap',
    };

    const formFieldStyle = {
        flex: '1 1 200px',
        minWidth: '200px',
    };

    return (
        <div style={pageStyle}>
            {/* Toast Notification */}
            {toast.show && (
                <div style={toastStyle}>
                    {toast.message}
                </div>
            )}

            {/* Profile Header */}
            <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '36px',
                                fontWeight: '700',
                                border: '3px solid rgba(255,255,255,0.3)',
                                overflow: 'hidden',
                            }}>
                                {profile.profile_picture ? (
                                    <img src={profile.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            {isEditing && (
                                <label style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: '#fa82a7',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                    <input type="file" style={{ display: 'none' }} onChange={handleProfilePictureUpload} accept="image/*" />
                                    <span style={{ fontSize: '18px', color: '#fff', marginTop: '-2px' }}>+</span>
                                </label>
                            )}
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 6px 0', fontSize: '26px', fontWeight: '700' }}>
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            background: isEditing ? '#fa82a7' : 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            border: isEditing ? 'none' : '2px solid rgba(255,255,255,0.3)',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isEditing ? 'Done Editing' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Resume Section */}
            <div style={cardStyle} className="glow-card">
                <h3 style={sectionTitleStyle}>
                    Resume
                </h3>
                <div style={formRowStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Current Resume</label>
                        {profile?.resume ? (
                            <a href={profile.resume} target="_blank" rel="noreferrer"
                                style={{ color: '#fa82a7', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
                                View Uploaded Resume →
                            </a>
                        ) : (
                            <p style={{ color: '#999', fontSize: '15px', margin: 0 }}>No resume uploaded yet</p>
                        )}
                    </div>
                    {isEditing && (
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Upload New Resume (PDF)</label>
                            <form onSubmit={handleResumeUpload} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="file"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    accept=".pdf"
                                    style={{ fontSize: '14px', color: '#333' }}
                                />
                                <button type="submit" style={{ ...buttonStyle, padding: '10px 20px' }}>Upload</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Skills Section */}
            <div style={cardStyle} className="glow-card">
                <h3 style={sectionTitleStyle}>
                    Skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    {profile.skills.length === 0 && (
                        <p style={{ color: '#999', fontSize: '15px', margin: 0 }}>No skills added yet</p>
                    )}
                    {profile.skills.map((skill, index) => (
                        <span key={index} style={tagStyle}>
                            {skill}
                            {isEditing && (
                                <span
                                    onClick={() => removeSkill(index)}
                                    style={{ cursor: 'pointer', fontSize: '16px', opacity: 0.8 }}
                                >×</span>
                            )}
                        </span>
                    ))}
                </div>
                {isEditing && (
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '500px' }}>
                        <input
                            placeholder="Add a new skill..."
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && addSkill()}
                            style={inputStyle}
                        />
                        <button onClick={addSkill} style={buttonStyle}>Add</button>
                    </div>
                )}
            </div>

            {/* Experience Section */}
            <div style={cardStyle} className="glow-card">
                <h3 style={sectionTitleStyle}>
                    Experience
                </h3>
                {profile.experience.length === 0 && (
                    <p style={{ color: '#999', fontSize: '15px', marginBottom: '20px' }}>No experience added yet</p>
                )}
                {profile.experience.map((exp, index) => (
                    <div key={index} style={itemCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', color: '#1a1a2e', fontSize: '17px', fontWeight: '600' }}>{exp.title}</h4>
                                <p style={{ margin: '0 0 4px 0', color: '#fa82a7', fontSize: '15px', fontWeight: '500' }}>{exp.company}</p>
                                <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '13px' }}>{exp.dates}</p>
                                <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{exp.description}</p>
                            </div>
                            {isEditing && (
                                <button onClick={() => removeExperience(index)} style={removeButtonStyle}>Remove</button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Experience Form - Stacked Layout */}
                {isEditing && (
                    <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '14px', marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>Add New Experience</h4>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Job Title *</label>
                                <input placeholder="e.g. Software Engineer" value={newExp.title} onChange={e => setNewExp({ ...newExp, title: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Company *</label>
                                <input placeholder="e.g. Google" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} style={inputStyle} />
                            </div>
                        </div>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Duration *</label>
                                <input placeholder="e.g. Jan 2020 - Present" value={newExp.dates} onChange={e => setNewExp({ ...newExp, dates: e.target.value })} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Description *</label>
                            <textarea
                                placeholder="Describe your responsibilities and achievements..."
                                value={newExp.description}
                                onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                        <button onClick={addExperience} style={buttonStyle}>Add Experience</button>
                    </div>
                )}
            </div>

            {/* Education Section */}
            <div style={cardStyle} className="glow-card">
                <h3 style={sectionTitleStyle}>
                    Education
                </h3>
                {profile.education.length === 0 && (
                    <p style={{ color: '#999', fontSize: '15px', marginBottom: '20px' }}>No education added yet</p>
                )}
                {profile.education.map((edu, index) => (
                    <div key={index} style={itemCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#1a1a2e', fontSize: '17px', fontWeight: '600' }}>{edu.degree}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{edu.institution} • {edu.year}</p>
                            </div>
                            {isEditing && (
                                <button onClick={() => removeEducation(index)} style={removeButtonStyle}>Remove</button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Education Form - Stacked Layout */}
                {isEditing && (
                    <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '14px', marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>Add New Education</h4>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Degree *</label>
                                <input placeholder="e.g. Bachelor of Technology" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Institution *</label>
                                <input placeholder="e.g. MIT" value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ ...formFieldStyle, maxWidth: '150px' }}>
                                <label style={labelStyle}>Year *</label>
                                <input placeholder="e.g. 2024" value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: e.target.value })} style={inputStyle} />
                            </div>
                        </div>
                        <button onClick={addEducation} style={buttonStyle}>Add Education</button>
                    </div>
                )}
            </div>

            {/* Certifications Section */}
            <div style={cardStyle} className="glow-card">
                <h3 style={sectionTitleStyle}>
                    Certifications
                </h3>
                {profile.certifications.length === 0 && (
                    <p style={{ color: '#999', fontSize: '15px', marginBottom: '20px' }}>No certifications added yet</p>
                )}
                {profile.certifications.map((cert, index) => (
                    <div key={index} style={itemCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#1a1a2e', fontSize: '17px', fontWeight: '600' }}>{cert.name}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{cert.issuer} • {cert.year}</p>
                            </div>
                            {isEditing && (
                                <button onClick={() => removeCertification(index)} style={removeButtonStyle}>Remove</button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Certification Form - Stacked Layout */}
                {isEditing && (
                    <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '14px', marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>Add New Certification</h4>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Certification Name *</label>
                                <input placeholder="e.g. AWS Solutions Architect" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>Issuing Organization *</label>
                                <input placeholder="e.g. Amazon Web Services" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={{ ...formFieldStyle, maxWidth: '150px' }}>
                                <label style={labelStyle}>Year *</label>
                                <input placeholder="e.g. 2023" value={newCert.year} onChange={e => setNewCert({ ...newCert, year: e.target.value })} style={inputStyle} />
                            </div>
                        </div>
                        <button onClick={addCertification} style={buttonStyle}>Add Certification</button>
                    </div>
                )}
            </div>

            {/* CSS Animation for Toast */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
