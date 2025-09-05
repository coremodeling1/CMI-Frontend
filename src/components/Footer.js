import React from "react";
import "../styles/style.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/responsive.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleProjectsClick = (e) => {
    e.preventDefault();
    if (!user) return navigate("/");
    switch (user.role) {
      case "artist":
        navigate("/projects");
        break;
      case "recruiter":
        navigate("/recruiterProjects");
        break;
      case "admin":
        navigate("/adminProjects");
        break;
      default:
        navigate("/");
    }
  };

  const handleBlogsClick = (e) => {
    e.preventDefault();
    if (!user) return navigate("/");
    if (user.role === "admin") navigate("/adminBlogs");
    else navigate("/blogs");
  };

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand / About */}
        <div className="footer-section">
          <img 
            src={require("../images/logo.png")}  // ✅ your logo path
            alt="CoreModeling Logo" 
            className="footer-logo"
          />
          <h3>CoreModeling</h3>
          <p>
            Connecting talent with opportunities worldwide. Empowering artists and recruiters with seamless collaboration. 
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate("/artists")} style={{ cursor: "pointer" }}>
              Artists
            </li>
            <li onClick={handleProjectsClick} style={{ cursor: "pointer" }}>
              Projects
            </li>
            <li onClick={handleBlogsClick} style={{ cursor: "pointer" }}>
              Blogs
            </li>
         
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>Categories</h3>
          <div className="categories">
            <ul className="footer-categories">
              {[
                "Model",
                "Actor",
                "Influencer",
                "Writer",
                "Stylist",
                "Photographer",
                "Advertising Professional",
                "Singer",
                "Musician",
                "Dancer",
                "Anchor",
                "Voice-over Artist",
                "Filmmaker",
                "Standup Comedian",
              ].map((cat, i) => (
                <li key={i}>{cat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: coremodeling1@gmail.com</p>
          <p>Phone: +91 9876543210</p>
          <p>
            Address:  1st FLR OFFICE NO-02 SEASONS HARMONY NR AYUSH NX KALYAN WEST 
            Kalyan West, Maharashtra 421301
          </p>
          <div className="social-icons">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <p className="footer-bottom">
        © 2025 CoreModeling. All Rights Reserved. 
      </p>
    </footer>
  );
};

export default Footer;
