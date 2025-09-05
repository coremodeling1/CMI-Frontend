import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/RecruiterProjects.css";

const backendURL = "http://localhost:5000";

const RecruiterProjects = () => {
   const navigate = useNavigate(); // 👈 hook for navigation

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

  const artistRoles = [
    "Model",
    "Actor",
    "Influencer",
    "Singer",
    "Musician",
    "Dancer",
    "Writer",
    "Anchor",
    "Stylist",
    "Advertising Professional",
    "Voice-over Artist",
    "Photographer",
    "Filmmaker",
    "Standup Comedian",
  ];

  const user = JSON.parse(localStorage.getItem("user"));

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

    // 👇 Add postedBy immediately so the delete button appears
    const jobWithUser = {
      ...newJob,
      postedBy: { _id: user._id, name: user.name || "You" },
    };

    setJobs([jobWithUser, ...jobs]);
    setShowForm(false);
    setMessage("Job posted successfully!");
    setFormData({
      jobTitle: "",
      jobDescription: "",
      requiredArtist: "",
      recruiterName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    });
  } catch (err) {
    console.error("Error posting job:", err);
    setMessage("Error posting job");
  }
};

  // --- New: Handle delete job ---
  const handleDelete = async (jobId) => {
    try {
      // Optimistic update: remove from frontend immediately
      setJobs(jobs.filter((job) => job._id !== jobId));

      // Backend call to delete the job (we'll implement API later)
      await fetch(`${backendURL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    } catch (err) {
      console.error("Error deleting job:", err);
      setMessage("Failed to delete job");
      // Revert UI if deletion fails
      fetchJobs();
    }
  };

    const filteredJobs = jobs.filter(
  (job) =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.recruiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="recruiter-projects-page">
      <Navbar />
<div className="search-bar">
  <input
    type="text"
    placeholder="Search jobs by title, recruiter, or description..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
  filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.jobTitle}</h3>
              <p>
                <strong>Description:</strong> {job.jobDescription}
              </p>
              <p>
                <strong>Required Artist:</strong> {job.requiredArtist}
              </p>
              <p>
                <strong>Recruiter:</strong> {job.recruiterName}
              </p>
              <p>
                <strong>Contact:</strong> {job.contactEmail}, {job.contactPhone}
              </p>
              <p>
                <strong>Address:</strong> {job.address}
              </p>

              {/* Show delete button only for the recruiter who posted the job */}
              {job.postedBy._id === user?._id && (
                <button
                  className="delete-job-btn"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete Job
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>

      {/* Floating Create Job Button */}
      <button
        className="floating-create-btn"
        onClick={() => setShowForm(true)}
      >
        + Create Job
      </button>

      <button
        className="floating-yourjobs-btn"
        onClick={() => navigate("/posted-jobs")}
      >
        Your Jobs
      </button>


      {/* Floating Form Modal */}
      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal-card">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <h2 className="heading">Post a Job for Artists</h2>
            {message && <p className="form-message">{message}</p>}
            <form className="job-form" onSubmit={handleSubmit}>
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />

              <label>Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={5}
                required
              />

              <label>Required Artist Role</label>
              <select
                name="requiredArtist"
                value={formData.requiredArtist}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {artistRoles.map((role) => (
                  <option key={role} value={role.toLowerCase()}>
                    {role}
                  </option>
                ))}
              </select>

              <label>Recruiter / Company Name</label>
              <input
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                required
              />

              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />

              <label>Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
              />

              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
              />

              <button type="submit" className="submit-btn">
                Post Job
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RecruiterProjects;
