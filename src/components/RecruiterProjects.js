import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/RecruiterProjects.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const RecruiterProjects = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    requiredArtist: "",
    recruiterName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const artistRoles = [
    "Model", "Actor", "Influencer", "Singer", "Musician", "Dancer",
    "Writer", "Anchor", "Stylist", "Advertising Professional",
    "Voice-over Artist", "Photographer", "Filmmaker", "Standup Comedian"
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  // ... keep all your existing functions exactly the same (fetchJobs, handleSubmit, handleDelete, etc.)
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/jobs`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      const sortedJobs = [
        ...data.filter((job) => job.postedBy._id === user?._id),
        ...data.filter((job) => job.postedBy._id !== user?._id),
      ];
      setJobs(sortedJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }, [user?.token, user?._id]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backendURL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post job");
      }

      const newJob = await res.json();
      const jobWithUser = {
        ...newJob,
        postedBy: { _id: user._id, name: user.name || "You" },
      };

      setJobs([jobWithUser, ...jobs]);
      setShowForm(false);
      setMessage("✅ Job posted successfully!");
      setFormData({
        jobTitle: "", jobDescription: "", requiredArtist: "",
        recruiterName: "", contactEmail: "", contactPhone: "", address: ""
      });
    } catch (err) {
      console.error("Error posting job:", err);
      setMessage("❌ Error posting job");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      setJobs(jobs.filter((job) => job._id !== jobId));
      await fetch(`${backendURL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setMessage("✅ Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      setMessage("❌ Failed to delete job");
      fetchJobs();
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.recruiterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canPostJobs = user?.role === "recruiter" && user?.premiumStatus === "granted";

  return (
    <>
      <Navbar />
      <div className="recruiter-projects-page">
        <h1 className="page-title">Recruiter Dashboard</h1>

        <div className="header-controls">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search jobs by title, recruiter, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className={`your-jobs-btn ${!canPostJobs ? 'disabled' : ''}`}
              onClick={() => navigate("/posted-jobs")}
            >
              📋 Your Projects
            </button>
            <button 
              className={`create-project-btn ${!canPostJobs ? 'disabled' : ''}`}
              onClick={() => {
                if (!canPostJobs) {
                  alert("🚫 Premium required to post jobs. Upgrade your account!");
                  return;
                }
                setShowForm(true);
              }}
            >
              ➕ Create Project
            </button>
          </div>
        </div>

        {!canPostJobs && (
          <div className="premium-banner">
            <div className="banner-content">
              <span className="banner-icon">🚫</span>
              <span>Premium required to post jobs. Upgrade now!</span>
              <button className="upgrade-btn" onClick={() => navigate("/recruiters")}>
                Upgrade
              </button>
            </div>
          </div>
        )}

        <div className="projects-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className={`job-card ${job.postedBy._id === user?._id ? 'your-job' : ''}`} key={job._id || index}>
                <div className="card-header">
                  <h3 className="job-title">{job.jobTitle || "Untitled Project"}</h3>
                  {job.postedBy._id === user?._id && (
                    <span className="your-job-badge">👑 Yours</span>
                  )}
                </div>

                <div className="job-description-scroll">
                  <p>{job.jobDescription || "No description available"}</p>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🎨</span>
                    <span className="meta-label">Artist:</span>
                    <span className="meta-value">{job.requiredArtist || "Any"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span className="meta-label">Recruiter:</span>
                    <span className="meta-value">{job.recruiterName || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span className="meta-label">Contact:</span>
                    <span className="meta-value">
                      {job.contactEmail || "N/A"} {job.contactPhone && `• ${job.contactPhone}`}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{job.address || "Remote"}</span>
                  </div>
                </div>

                {job.postedBy._id === user?._id && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(job._id)}
                  >
                    🗑️ Delete Project
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No projects {searchTerm ? `matching "${searchTerm}"` : "found yet"}</p>
              {canPostJobs && (
                <p className="empty-subtitle">Click "Create Project" to get started!</p>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Create Job Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Project</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              {message && (
                <div className={`message-banner ${message.includes('✅') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="job-creation-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Required Artist Role</label>
                    <select
                      name="requiredArtist"
                      value={formData.requiredArtist}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {artistRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Company/Recruiter Name</label>
                    <input
                      type="text"
                      name="recruiterName"
                      value={formData.recruiterName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Project Description</label>
                    <textarea
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe the project requirements, duration, pay, etc..."
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Location/Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Office address or 'Remote'"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Creating..." : "Post Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RecruiterProjects;
