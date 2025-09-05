import React, { useState, useEffect,useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AdminProjects.css"; // you can reuse the same CSS

const backendURL = "http://localhost:5000";

const AdminProjects = () => {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/jobs`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ... rest of your component


  // Handle approve/reject
  const updateStatus = async (jobId, status) => {
    try {
      const res = await fetch(`${backendURL}/api/jobs/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedJob = await res.json();
      // Update job in local state
      setJobs(jobs.map((job) => (job._id === jobId ? updatedJob : job)));
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  return (
    <div className="admin-projects-page">
      <Navbar />
  <h1 className="page-title">Admin - Manage Projects</h1>
      <div className="jobs-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.jobTitle}</h3>
              <p><strong>Description:</strong> {job.jobDescription}</p>
              <p><strong>Required Artist:</strong> {job.requiredArtist}</p>
              <p><strong>Recruiter:</strong> {job.recruiterName}</p>
              <p><strong>Contact:</strong> {job.contactEmail}, {job.contactPhone}</p>
              <p><strong>Address:</strong> {job.address}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: job.status === "approved" ? "green" : job.status === "rejected" ? "red" : "orange" }}>
                  {job.status.toUpperCase()}
                </span>
              </p>

              {job.status === "pending" && (
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button
                    className="submit-btn"
                    style={{ backgroundColor: "#040404ff" }}
                    onClick={() => updateStatus(job._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="submit-btn"
                    style={{ backgroundColor: "#dc3545" }}
                    onClick={() => updateStatus(job._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminProjects;
