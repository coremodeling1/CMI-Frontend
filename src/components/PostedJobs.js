import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/PostedJobs.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const applicantsRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendURL}/api/jobs`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        const myJobs = data.filter((job) => job.postedBy._id === user?._id);
        setJobs(myJobs);
      } catch (err) {
        console.error("Error fetching posted jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const handleJobClick = async (jobId) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendURL}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();

      const approvedApps = data.filter((app) => app.user?.status === "approved");

      setSelectedJob(jobId);
      setSelectedJobDetails(jobs.find((j) => j._id === jobId));
      setApplications(approvedApps);

      setTimeout(() => {
        applicantsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Force download PDF instead of preview
  const getDownloadUrl = (cvUrl) => {
    if (!cvUrl) return cvUrl;
    return cvUrl.replace('/upload/', '/upload/fl_attachment/');
  };

  return (
    <>
      <Navbar />
      <div className="posted-jobs-page">
        <div className="page-header">
          <h2>Your Posted Projects</h2>
          {loading && <div className="loading-spinner">Loading...</div>}
        </div>

        {jobs.length > 0 ? (
          <div className="job-cards-container">
            {jobs.map((job) => (
              <div
                className={`job-card ${selectedJob === job._id ? 'selected' : ''}`}
                key={job._id}
                onClick={() => handleJobClick(job._id)}
              >
                <div className="job-header">
                  <h3>{job.jobTitle}</h3>
                  <span className="job-badge">Click to view applicants</span>
                </div>
                <div className="job-description">
                  <p><strong>Description:</strong> {job.jobDescription}</p>
                </div>
                <div className="job-details">
                  <p><strong>🎨 Artist:</strong> {job.requiredArtist}</p>
                  <p><strong>📧 Contact:</strong> {job.contactEmail}</p>
                  <p><strong>📍 Location:</strong> {job.address}</p>
                </div>
                {selectedJob === job._id && (
                  <div className="selected-indicator">
                    ↓ Viewing applicants
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No jobs posted yet. <a href="/post-job">Post your first project!</a></p>
          </div>
        )}

        {/* Enhanced Applicants Section */}
        {selectedJob && (
          <div className="applicants-section" ref={applicantsRef}>
            <div className="section-header">
              <h3>
                🎯 Approved Applicants for: <span>{selectedJobDetails?.jobTitle}</span>
              </h3>
              <div className="applicant-count">
                {applications.length} approved applicant{applications.length !== 1 ? 's' : ''}
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="applicants-grid">
                {applications.map((app) => (
                  <div key={app._id} className="applicant-card">
                    <div className="applicant-header">
                      <div className="applicant-avatar">
                        {app.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="applicant-info">
                        <h4>{app.fullName}</h4>
                        <span className="location">{app.city}, {app.state}</span>
                      </div>
                    </div>

                    <div className="applicant-details">
                      <div className="detail-row">
                        <span className="label">📧 Email:</span>
                        <span>{app.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📞 Contact:</span>
                        <span>{app.contact}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">🎓 Experience:</span>
                        <span>{app.qualifications}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📅 DOB:</span>
                        <span>{app.dob}</span>
                      </div>
                    </div>

                    {app.cv && (
                      <div className="cv-download">
                        <a 
                          href={getDownloadUrl(app.cv)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="download-btn"
                          download
                        >
                          📄 Download CV
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-applicants">
                <p>No approved applicants yet. Keep your job active to attract more artists!</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostedJobs;
