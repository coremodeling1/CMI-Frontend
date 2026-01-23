import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AppliedJobs.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ SIMPLIFIED - No useCallback dependency hell
  const fetchAppliedJobs = async () => {
    if (!loggedInUser?. _id) {
      setLoading(false);
      setAppliedJobs([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${backendURL}/api/applications/user/${loggedInUser._id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      
      // ✅ Filter only valid applications with job data
      const validApplications = Array.isArray(data)
        ? data.filter(app => app.job && app.job._id && app.job.jobTitle)
        : [];
        
      setAppliedJobs(validApplications);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setAppliedJobs([]);
    } finally {
      setLoading(false); // ✅ ALWAYS set loading false
    }
  };

  // ✅ SIMPLE useEffect - no dependency issues
  useEffect(() => {
    fetchAppliedJobs();
  }, []); // ✅ Empty dependency array - runs once

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
                  <h3 className="job-title">{application.job.jobTitle}</h3>
                  <span className="status-badge active">✅ Applied</span>
                </div>

                <div className="job-description-scroll">
                  <p>{application.job.jobDescription || "No description available"}</p>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🎨</span>
                    <span className="meta-label">Role:</span>
                    <span className="meta-value">{application.job.requiredArtist}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span className="meta-label">Recruiter:</span>
                    <span className="meta-value">{application.job.recruiterName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span className="meta-label">Email:</span>
                    <span className="meta-value">{application.job.contactEmail}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{application.job.address || "Remote"}</span>
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
