// src/pages/Projects.js
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";   // 👈 for navigation
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Projects.css";
import "../styles/responsive.css"

const backendURL = "http://localhost:5000";

const Projects = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // 👈 store user's applied jobs
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

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch approved jobs
  const fetchApprovedJobs = async () => {
    try {
      const res = await fetch(`${backendURL}/api/jobs/approved`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // ✅ Fetch applied jobs for logged-in user
  const fetchAppliedJobs = async () => {
    if (!loggedInUser) return;
    try {
      const res = await fetch(`${backendURL}/api/applications/user/${loggedInUser._id}`);
      const data = await res.json();
      setAppliedJobs(data.map((app) => app.job._id)); // store only jobIds
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  useEffect(() => {
    fetchApprovedJobs();
    
    fetchAppliedJobs();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ When Apply button clicked
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };


  const filteredJobs = jobs.filter(
  (job) =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.recruiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
);


  // ✅ Submit Application
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert("You need to be logged in to apply for a job!");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("fullName", formData.fullName);
    formPayload.append("email", formData.email);
    formPayload.append("contact", formData.contact);
    formPayload.append("qualifications", formData.qualifications);
    formPayload.append("dob", formData.dob);
    formPayload.append("city", formData.city);
    formPayload.append("state", formData.state);
    formPayload.append("cv", formData.cv);
    formPayload.append("jobId", selectedJob._id);      
    formPayload.append("userId", loggedInUser._id);    

    fetch(`${backendURL}/api/applications/apply`, {
      method: "POST",
      body: formPayload,
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Error("Server did not return JSON");
        }
      })
      .then(() => {
        alert("Application submitted successfully!");
        setShowForm(false);
        setFormData({
          fullName: "",
          email: "",
          contact: "",
          qualifications: "",
          dob: "",
          city: "",
          state: "",
          cv: null,
        });
        fetchAppliedJobs(); // ✅ Refresh applied jobs after submission
      })
      .catch((err) => console.error("Error submitting application:", err));
  };

  return (
    <>
      <Navbar />
      <div className="projects-page">
        {/* ✅ Applied Jobs Button */}
        {/* ✅ Search Filter */}


       

        <h1 className="projects-title">Available Jobs for Artists</h1>

         <div className="applied-jobs-btn-container">
          <button 
            className="applied-jobs-btn"
            onClick={() => navigate("/applied-jobs")} // 👈 navigate to AppliedJobs.js
          >
            Applied Jobs
          </button>
        </div>
<div className="search-bar">
  <input
    type="text"
    placeholder="Search jobs by title, recruiter, or description..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
        <div className="projects-list">
        {filteredJobs.length > 0 ? (
  filteredJobs.map((job) => (

              <div className="project-card" key={job._id}>
                <h3>{job.jobTitle}</h3>
                <p><strong>Description:</strong> {job.jobDescription}</p>
                <p><strong>Required Artist:</strong> {job.requiredArtist}</p>
                <p><strong>Recruiter:</strong> {job.recruiterName}</p>
                <p><strong>Contact:</strong> {job.contactEmail}, {job.contactPhone}</p>
                <p><strong>Address:</strong> {job.address}</p>

                {appliedJobs.includes(job._id) ? (
                  <button className="applied-btn" disabled>
                    Applied
                  </button>
                ) : (
                  <button 
                    className="apply-btn"
                    onClick={() => handleApplyClick(job)}
                  >
                    Apply
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-jobs">No approved jobs available at the moment.</p>
          )}
        </div>

        {/* ✅ Floating Apply Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-form">
              <h2 className="form-heading">Apply for {selectedJob?.jobTitle}</h2>
              <p className="user-info-hint">
                You are applying as <strong>{loggedInUser?.name}</strong>
              </p>
              <form onSubmit={handleSubmit} className="apply-form">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Contact Number</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />

                <label>Qualifications</label>
                <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} required />

                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />

                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required />

                <label>Upload CV (PDF)</label>
                <input type="file" name="cv" accept="application/pdf" onChange={handleChange} required />

                <div className="form-actions">
                  <button type="submit" className="submit-btn">Submit Application</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Projects;
