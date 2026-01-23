import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AppliedJobs.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Simple fetch - only applied jobs with job details
  const fetchAppliedJobs = useCallback(async () => {
    if (!loggedInUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendURL}/api/applications/user/${loggedInUser._id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      
      // ✅ Filter only applications with valid job data
      const validApplications = Array.isArray(data) 
        ? data.filter(app => app.job && app.job._id)
        : [];
        
      setAppliedJobs(validApplications);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  return (
    <>
      <Navbar />
      <div className="applied-jobs-page">
        <h1 className="applied-title">My Applied Projects</h1>

        <div className="applied-jobs-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your applications...</p>
            </div>
          ) : appliedJobs.length > 0 ? (
            appliedJobs.map((application) => (
              <div className="applied-card" key={application._id}>
                <div className="card-header">
                  <h3 className="job-title">{application.job?.jobTitle || "Untitled Project"}</h3>
                  <span className="status-badge active">✅ Applied</span>
                </div>

                <div className="job-description-scroll">
                  <p>{application.job?.jobDescription || "No description available"}</p>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🎨</span>
                    <span className="meta-label">Role:</span>
                    <span className="meta-value">{application.job?.requiredArtist || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span className="meta-label">Recruiter:</span>
                    <span className="meta-value">{application.job?.recruiterName || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span className="meta-label">Email:</span>
                    <span className="meta-value">{application.job?.contactEmail || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{application.job?.address || "Remote"}</span>
                  </div>
                </div>

                <div className="application-date">
                  <span>Applied: {new Date(application.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No applications found</p>
              <p className="empty-subtitle">
                Apply to projects on the <a href="/projects">Projects page</a>
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppliedJobs;
