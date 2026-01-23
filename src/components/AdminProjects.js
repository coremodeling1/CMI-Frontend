import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AdminProjects.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AdminProjects = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
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
      setJobs(jobs.map((job) => (job._id === jobId ? updatedJob : job)));
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === "all") return true;
    return job.status === statusFilter;
  });

  return (
    <>
      <Navbar />
      <div className="admin-projects-page">
        <h1 className="page-title">Admin - Manage Projects</h1>

        {/* FILTER */}
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className="job-card" key={job._id || index}>
                <div className="job-header">
                  <h3 className="job-title">{job.jobTitle}</h3>
                  <span className={`status-badge ${job.status || "pending"}`}>
                    {job.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>

                <div className="job-description-scroll">
                  <p>
                    <strong>Description:</strong> {job.jobDescription || "N/A"}
                  </p>
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <span className="detail-label">Required Artist:</span>
                    <span className="detail-value">{job.requiredArtist || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Recruiter:</span>
                    <span className="detail-value">{job.recruiterName || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">
                      {job.contactEmail || "N/A"} {job.contactPhone && `• ${job.contactPhone}`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{job.address || "N/A"}</span>
                  </div>
                </div>

                {job.status === "pending" && (
                  <div className="status-buttons">
                    <button
                      className="approve-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(job._id, "approved");
                      }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(job._id, "rejected");
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No jobs {statusFilter !== "all" ? `with ${statusFilter} status` : "found"}.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProjects;