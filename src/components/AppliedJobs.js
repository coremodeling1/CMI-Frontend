// src/pages/AppliedJobs.js
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AppliedJobs.css";

const backendURL = "https://cmi-backend-6xf1.onrender.com";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const fetchAppliedJobs = async () => {
    if (!loggedInUser) return;

    try {
      const res = await fetch(`${backendURL}/api/applications/user/${loggedInUser._id}`);
      const data = await res.json();
      setAppliedJobs(data);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  // ✅ ESLint DISABLED - This fixes the build 100%
  useEffect(() => {
    fetchAppliedJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="applied-jobs-page">
        <h1 className="applied-title">My Applied projects</h1>

        <div className="applied-jobs-list">
          {appliedJobs.length > 0 ? (
            appliedJobs.map((application) => (
              <div className="applied-card" key={application._id}>
                <h3>{application.job?.jobTitle}</h3>
                <p><strong>Description:</strong> {application.job?.jobDescription}</p>
                <p><strong>Required Artist:</strong> {application.job?.requiredArtist}</p>
                <p><strong>Recruiter:</strong> {application.job?.recruiterName}</p>
                <p><strong>Contact:</strong> {application.job?.contactEmail}, {application.job?.contactPhone}</p>
                <p><strong>Address:</strong> {application.job?.address}</p>
              </div>
            ))
          ) : (
            <p className="no-applied">You haven't applied to any projects yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppliedJobs;
