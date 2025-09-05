import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/PostedJobs.css";

const backendURL = "http://localhost:5000";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null); // ✅ store job details
  const [applications, setApplications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const applicantsRef = useRef(null); // ✅ for scrolling

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

  const handleJobClick = async (jobId) => {
    try {
      const res = await fetch(`${backendURL}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();

      const approvedApps = data.filter((app) => app.user?.status === "approved");

      setSelectedJob(jobId);
      setSelectedJobDetails(jobs.find((j) => j._id === jobId)); // ✅ save full job details
      setApplications(approvedApps);

      // ✅ Scroll down to applicants section
      setTimeout(() => {
        applicantsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="posted-jobs-page">
        <h2>Your Posted Jobs</h2>
        {jobs.length > 0 ? (
          <div className="job-cards-container">
            {jobs.map((job) => (
              <div
                className="job-card"
                key={job._id}
                onClick={() => handleJobClick(job._id)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <h3>{job.jobTitle}</h3>
                <p><strong>Description:</strong> {job.jobDescription}</p>
                <p><strong>Required Artist:</strong> {job.requiredArtist}</p>
                <p><strong>Contact:</strong> {job.contactEmail}, {job.contactPhone}</p>
                <p><strong>Address:</strong> {job.address}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs posted yet.</p>
        )}

        {/* Show Applicants */}
        {selectedJob && (
          <div className="applicants-section" ref={applicantsRef}>
            <h3>
              Approved Applicants for:{" "}
              <span style={{ color: "white" }}>{selectedJobDetails?.jobTitle}</span>
            </h3>
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app._id} className="applicant-card">
                  <p><strong>Full Name:</strong> {app.fullName}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Contact:</strong> {app.contact}</p>
                  <p><strong>Qualifications:</strong> {app.qualifications}</p>
                  <p><strong>DOB:</strong> {app.dob}</p>
                  <p><strong>City:</strong> {app.city}</p>
                  <p><strong>State:</strong> {app.state}</p>
                  {app.cv && (
                    <p>
                      <strong>CV:</strong>{" "}
                      <a href={app.cv} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No approved applicants yet.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostedJobs;
