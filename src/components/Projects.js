import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Projects.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const Projects = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    qualifications: "",
    dob: "",
    city: "",
    state: "",
    cv: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ... keep all your existing functions exactly the same ...
  const fetchApprovedJobs = async () => {
    try {
      const res = await fetch(`${backendURL}/api/jobs/approved`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchAppliedJobs = useCallback(async () => {
    if (!loggedInUser) return;
    try {
      const res = await fetch(`${backendURL}/api/applications/user/${loggedInUser._id}`);
      const data = await res.json();
      const validJobIds = data.filter((app) => app.job && app.job._id).map((app) => app.job._id);
      setAppliedJobs(validJobIds);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchApprovedJobs();
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  useEffect(() => {
    const syncUser = async () => {
      if (!loggedInUser?.token) return;
      try {
        const res = await fetch(`${backendURL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const updated = { ...data, token: loggedInUser.token };
          localStorage.setItem("user", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    };
    syncUser();
  }, [loggedInUser?.token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApplyClick = (job) => {
    if (loggedInUser?.role === "artist" && loggedInUser?.status !== "approved") {
      alert("Your profile must be approved before applying for jobs.");
      return;
    }
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!loggedInUser) {
      alert("You need to be logged in to apply for a job!");
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formPayload.append(key, formData[key]);
    });
    formPayload.append("jobId", selectedJob._id);
    formPayload.append("userId", loggedInUser._id);

    try {
      const res = await fetch(`${backendURL}/api/applications/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${loggedInUser.token}` },
        body: formPayload,
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        await res.json();
      }

      alert("Application submitted successfully!");
      setShowForm(false);
      setFormData({
        fullName: "", email: "", contact: "", qualifications: "", dob: "", city: "", state: "", cv: null,
      });
      fetchAppliedJobs();
    } catch (err) {
      console.error("Error submitting application:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.recruiterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="projects-page">
        <h1 className="projects-title">Available Projects for Artists</h1>

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
          <button className="applied-jobs-btn" onClick={() => navigate("/applied-jobs")}>
            👨‍💼 Applied Projects
          </button>
        </div>

        <div className="projects-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className="project-card" key={job._id || index}>
                <div className="card-header">
                  <h3 className="job-title">{job.jobTitle || "Untitled Project"}</h3>
                </div>

                <div className="job-description-scroll">
                  <p>{job.jobDescription || "No description available"}</p>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-label">🎨 Artist:</span>
                    <span className="meta-value">{job.requiredArtist || "Any"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">👤 Recruiter:</span>
                    <span className="meta-value">{job.recruiterName || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📧 Contact:</span>
                    <span className="meta-value">
                      {job.contactEmail || "N/A"} {job.contactPhone && `• ${job.contactPhone}`}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📍 Location:</span>
                    <span className="meta-value">{job.address || "Remote"}</span>
                  </div>
                </div>

                <div className="card-footer">
                  {appliedJobs.includes(job._id) ? (
                    <button className="status-btn applied" disabled>
                      ✅ Applied
                    </button>
                  ) : loggedInUser?.role === "artist" && loggedInUser?.status !== "approved" ? (
                    <button className="status-btn pending" disabled>
                      ⏳ Approval Required
                    </button>
                  ) : (
                    <button className="apply-btn" onClick={() => handleApplyClick(job)}>
                      🚀 Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No approved projects {searchTerm ? `matching "${searchTerm}"` : "available"} at the moment.</p>
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Apply for <span className="job-title-highlight">{selectedJob?.jobTitle}</span></h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>
              
              <div className="user-info-bar">
                Applying as: <strong>{loggedInUser?.name || "Artist"}</strong>
              </div>

              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                  </div>

                  <div className="form-group full-width">
                    <label>Experience / Qualifications</label>
                    <textarea 
                      name="qualifications" 
                      value={formData.qualifications} 
                      onChange={handleChange} 
                      rows="3"
                      placeholder="Describe your relevant experience, skills, and qualifications..."
                      required 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Upload CV (PDF only)</label>
                    <input type="file" name="cv" accept="application/pdf" onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
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

export default Projects;
