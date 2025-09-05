import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Recruiters.css";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/recruiters");
        const data = await res.json();
        setRecruiters(data);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
      }
    };
    fetchRecruiters();
  }, []);

 const handlePremiumUpdate = async (id, status) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token; // ✅ token saved at login

    if (!token) {
      console.error("No token found, please login again.");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/auth/recruiters/${id}/premium`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ add token
        },
        body: JSON.stringify({ premiumStatus: status }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setRecruiters((prev) =>
        prev.map((rec) =>
          rec._id === id
            ? { ...rec, premiumStatus: data.recruiter.premiumStatus }
            : rec
        )
      );
    } else {
      console.error("Error:", data.message);
    }
  } catch (err) {
    console.error("Error updating premium status:", err);
  }
};


  return (
    <div className="recruiters-page">
      <Navbar />

      <main className="recruiters-content">
        <h1>Recruiters</h1>

        <div className="recruiters-grid">
          {recruiters.length > 0 ? (
            recruiters.map((rec) => (
              <div className="recruiter-card" key={rec._id}>
                <img
                  src={rec.profilePic || "https://via.placeholder.com/150"}
                  alt={rec.name}
                  className="recruiter-img"
                />
                <h3 className="recruiter-name">{rec.name}</h3>

                <div className="recruiter-info">
                  <p><strong>Email:</strong> {rec.email}</p>
                  <p><strong>Contact:</strong> {rec.contact || "N/A"}</p>
                  <p>
                    <strong>Premium:</strong>{" "}
                    <span
                      className={`status-badge ${
                        rec.premiumStatus ? rec.premiumStatus : "none"
                      }`}
                    >
                      {rec.premiumStatus ? rec.premiumStatus : "Not Set"}
                    </span>
                  </p>
                </div>

                <div className="button-group">
                  <button
                    className={`btn grant ${
                      rec.premiumStatus === "granted" ? "active" : ""
                    }`}
                    onClick={() => handlePremiumUpdate(rec._id, "granted")}
                  >
                    {rec.premiumStatus === "granted" ? "Granted" : "Grant Premium"}
                  </button>
                  <button
                    className={`btn deny ${
                      rec.premiumStatus === "denied" ? "active" : ""
                    }`}
                    onClick={() => handlePremiumUpdate(rec._id, "denied")}
                  >
                    {rec.premiumStatus === "denied" ? "Denied" : "Deny Premium"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No recruiters found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recruiters;
