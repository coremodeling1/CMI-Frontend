import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import logo from "../images/logo.png";
import { Menu, X } from "lucide-react"; // ✅ For hamburger icons

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
    setMenuOpen(false); // close after click
  };

  const handleBlogsClick = (e) => {
    e.preventDefault();
    if (!user) return navigate("/");
    if (user.role === "admin") navigate("/adminBlogs");
    else navigate("/blogs");
    setMenuOpen(false); // close after click
  };

return (
  <nav className="navbar">
    <div className="logo">
      <a href="/home">
        <img src={logo} alt="CoreModeling Logo" className="navbar-logo" />
      </a>
    </div>
{/* ✅ Show Premium button depending on premiumStatus */}
{user?.role === "recruiter" && (
  user?.premiumStatus === "granted" ? (
    <button className="premium-btn desktop-only" disabled>
      Premium Member
    </button>
  ) : (
    <a href="/buy-premium" className="buy-premium-btn desktop-only">
      Buy Premium
    </a>
  )
)}

    {/* ✅ Desktop Nav */}
    <div className="nav-center desktop-nav">
      <a href="/home">Home</a>
      <a href="/artists">Artists</a>

      
          {/* ✅ Show Recruiters link only for admin */}
  {user?.role === "admin" && <a href="/recruiters">Recruiters</a>}
      <a href="/projects" onClick={handleProjectsClick}>
        Projects
      </a>
      <a href="/blogs" onClick={handleBlogsClick}>
        Blogs
      </a>
    
    </div>

    <div className="nav-right desktop-nav">
      {user && user.role !== "admin" && (
        <div
          className="profile-container"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <p className="profile-text">Your Profile</p>
        </div>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* ✅ Mobile Hamburger Button */}
    <div className="mobile-nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <X size={28} /> : <Menu size={28} />}
    </div>

    {/* ✅ Mobile Menu */}
    {menuOpen && (
      <div className="mobile-menu">
        <a href="/home" onClick={() => setMenuOpen(false)}>
          Home
        </a>
        <a href="/artists" onClick={() => setMenuOpen(false)}>
          Artists
        </a>
                 {/* ✅ Show Recruiters only for admin */}
  {user?.role === "admin" && (
    <a href="/recruiters" onClick={() => setMenuOpen(false)}>
      Recruiters
    </a>
  )}
        <a href="/projects" onClick={handleProjectsClick}>
          Projects
        </a>
        <a href="/blogs" onClick={handleBlogsClick}>
          Blogs
        </a>

 

      {/* ✅ Show Premium button inside hamburger menu */}
{user?.role === "recruiter" && (
  user?.premiumStatus === "granted" ? (
    <button className="premium-btn mobile-only" disabled>
      Premium Member
    </button>
  ) : (
    <a
      href="/buy-premium"
      onClick={() => setMenuOpen(false)}
      className="buy-premium-btn mobile-only"
    >
      Buy Premium
    </a>
  )
)}


          {user && user.role !== "admin" && (
            <div
              className="profile-container"
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="profile-avatar"
              />
              <p className="profile-text">Your Profile</p>
            </div>
          )}

          <button
            className="logout-btn"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
