// PostedJobs.js - Complete improved code with View Applicants button
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
        const res = await fetch(`${backendURL}/api/jobs`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        const myJobs = data.filter((job) => job.postedBy._id === user?._id);
        setJobs(myJobs);
      } catch (err) {
        console.error("Error fetching posted jobs:", err);
      }
    };
    fetchJobs();
  }, [user]);

  const handleViewApplicants = async (jobId, job) => {
    if (selectedJob === jobId) {
      // Toggle off if already viewing
      setSelectedJob(null);
      setApplications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();

      const approvedApps = data.filter((app) => app.user?.status === "approved");

      setSelectedJob(jobId);
      setSelectedJobDetails(job);
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

  return (
    <>
      <Navbar />
      <div className="posted-jobs-page">
        <h2>Your Posted Projects</h2>
        {jobs.length > 0 ? (
          <div className="job-cards-container">
            {jobs.map((job) => (
              <div className="job-card-wrapper" key={job._id}>
                <div className="job-card">
                  <div className="job-header">
                    <h3>{job.jobTitle}</h3>
                    <div className="job-badge">
                      {applications.length > 0 && selectedJob === job._id 
                        ? `${applications.length} applicants`
                        : 'New'
                      }
                    </div>
                  </div>
                  
                  <div className="job-description-scroll">
                    <p><strong>Description:</strong> {job.jobDescription}</p>
                  </div>
                  
                  <div className="job-details">
                    <p><strong>Artist:</strong> {job.requiredArtist}</p>
                    <p><strong>Contact:</strong> {job.contactEmail}</p>
                    <p><strong>Location:</strong> {job.address}</p>
                  </div>

                  <button
                    className={`view-applicants-btn ${
                      selectedJob === job._id ? 'active' : ''
                    } ${loading && selectedJob === job._id ? 'loading' : ''}`}
                    onClick={() => handleViewApplicants(job._id, job)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 
                     selectedJob === job._id ? 'Hide Applicants' : 'View Applicants'
                    }
                  </button>
                </div>

                {/* Inline applicants for this job */}
                {selectedJob === job._id && applications.length > 0 && (
                  <div className="inline-applicants" ref={applicantsRef}>
                    <div className="applicants-section">
                      <h3>
                        Approved Applicants for <span>{job.jobTitle}</span>
                      </h3>
                      <div className="applicants-grid">
                        {applications.map((app) => (
                          <div key={app._id} className="applicant-card">
                            <div className="applicant-header">
                              <h4>{app.fullName}</h4>
                              <span className="approved-badge">Approved</span>
                            </div>
                            <div className="applicant-details">
                              <p><strong>Email:</strong> {app.email}</p>
                              <p><strong>Phone:</strong> {app.contact}</p>
                              <p><strong>Experience:</strong> {app.qualifications}</p>
                              <p><strong>Location:</strong> {app.city}, {app.state}</p>
                              <p><strong>DOB:</strong> {app.dob}</p>
                            </div>
                            {app.cv && (
                              <div className="cv-section">
                                <a
                                  href={app.cv}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cv-link"
                                >
                                  📄 View CV
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No jobs posted yet. Create your first project!</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostedJobs;