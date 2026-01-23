import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AppliedJobs.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]); // ✅ New state for job verification
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch applied jobs for logged-in user
  const fetchAppliedJobs = useCallback(async () => {
    if (!loggedInUser) return;

    try {
      const res = await fetch(`${backendURL}/api/applications/user/${loggedInUser._id}`);
      const data = await res.json();
      setAppliedJobs(data);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  }, [loggedInUser]);

  // ✅ Fetch all jobs to verify if they still exist
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/jobs`);
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchAppliedJobs, fetchJobs]);

  // ✅ Filter out deleted jobs
  const validAppliedJobs = appliedJobs.filter((application) => {
    if (!application.job) return false;
    return jobs.some((job) => job._id === application.job._id);
  });

  return (
    <>
      <Navbar />
      <div className="applied-jobs-page">
        <h1 className="applied-title">My Applied Projects</h1>

        <div className="applied-stats">
          <div className="stat-card">
            <span className="stat-number">{validAppliedJobs.length}</span>
            <span className="stat-label">Active Applications</span>
          </div>
          <div className="stat-card expired">
            <span className="stat-number">{appliedJobs.length - validAppliedJobs.length}</span>
            <span className="stat-label">Expired (Job Deleted)</span>
          </div>
        </div>

        <div className="applied-jobs-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your applications...</p>
            </div>
          ) : validAppliedJobs.length > 0 ? (
            validAppliedJobs.map((application) => (
              <div className="applied-card" key={application._id}>
                <div className="card-header">
                  <h3 className="job-title">{application.job?.jobTitle || "Untitled Project"}</h3>
                  <span className="status-badge active">Active</span>
                </div>

                <div className="job-description-scroll">
                  <p>{application.job?.jobDescription || "No description available"}</p>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🎨</span>
                    <span className="meta-label">Artist Role:</span>
                    <span className="meta-value">{application.job?.requiredArtist || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span className="meta-label">Recruiter:</span>
                    <span className="meta-value">{application.job?.recruiterName || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span className="meta-label">Contact:</span>
                    <span className="meta-value">
                      {application.job?.contactEmail || "N/A"} 
                      {application.job?.contactPhone && ` • ${application.job.contactPhone}`}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{application.job?.address || "Remote"}</span>
                  </div>
                </div>

                <div className="application-date">
                  <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>You haven't applied to any active projects yet.</p>
              <p className="empty-subtitle">
                Find amazing opportunities on the <a href="/projects">Projects page</a>!
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