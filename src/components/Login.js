import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/style.css";
import slide1 from "../images/slide1.jpg";
import step1 from "../images/step1.png"
import about1 from "../images/about1.jpg";
import about2 from "../images/about2.jpg";
import about3 from "../images/about3.jpg";
import Signup from "./Signup";
import logo from "../images/logo.png";
import "../styles/responsive.css"
import Footer from "./Footer";   // ✅ Import Footer

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const slides = [slide1, slide1, slide1];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);



const stepsData = [
  {
    img: step1,
    title: "Sign Up & Login",
    desc: "Both Recruiters and Artists can create an account and log in to start using CoreModeling.",
  },
  {
    img: "/images/explore-artists.png",
    title: "Explore Artists",
    desc: "Recruiters can browse artist profiles, view their portfolios, photos, and videos.",
  },
  {
    img: "/images/upload-projects.png",
    title: "Upload Projects",
    desc: "Recruiters can upload exciting modeling projects for artists to discover and apply to.",
  },
  {
    img: "/images/apply-projects.png",
    title: "Apply to Projects",
    desc: "Artists can explore available projects and send their applications directly through the platform.",
  },
  {
    img: "/images/gallery.png",
    title: "Build Your Gallery",
    desc: "Artists can upload photos and videos to their personal gallery to showcase their talent.",
  },
];



  const [activeIndex, setActiveIndex] = useState(0);





  // Input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (res && res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/home");
      } else {
        alert("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  
return (
  <div className="landing-page">
    {/* Navbar */}
    <nav className="auth-navbar">
      <div className="auth-logo">
        <div className="logo">
          <img src={logo} alt="CoreModeling Logo" className="navbar-logo" />
        </div>
      </div>
      <ul className="auth-nav-links center-nav">
        <li><Link to="/home">Home</Link></li>
        <li><span onClick={() => setShowLogin(true)}>Login</span></li>
        <li><span onClick={() => setShowSignup(true)}>Signup</span></li>
      
      </ul>
    </nav>

    {/* Hero Section + Slideshow */}
    <div className="hero-wrapper">
      <div
        className="slideshow"
        style={{ backgroundImage: `url(${slides[currentSlide]})` }}
      ></div>

      <header className="hero-section">
        <h1>Welcome to CoreModeling</h1>
        <p className="tagline">Where Talent Meets Spotlight</p>
        <p>
          Connecting <strong>Artists</strong>, <strong>Recruiters</strong>, and{" "}
          <strong>Creators</strong> in one powerful platform.
        </p>
        <button onClick={() => setShowSignup(true)} className="explore-btn">
          Get Started
        </button>
      </header>


       {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h2> For Artists</h2>
          <p>Showcase your talent and connect with top recruiters worldwide.</p>
        </div>
        <div className="feature-card">
          <h2> For Recruiters</h2>
          <p>Discover passionate artists and build your dream team easily.</p>
        </div>
        <div className="feature-card">
          <h2> Blogs & Updates</h2>
          <p>Stay inspired with the latest trends and success stories.</p>
        </div>
      </section>
    </div>


<section className="about-section">
  <div className="about-container">
    {/* Left Side - Text */}
    <div className="about-text">
      <p className="intro">Welcome to CoreModeling</p>
      <h2 className="title">Connecting Artists & Recruiters</h2>
      <p className="description">
        CoreModeling is a dedicated platform built to bridge the gap between 
        talented artists and recruiters. Whether you’re an artist seeking 
        exciting projects or a recruiter searching for the right talent, 
        CoreModeling provides a space where creativity meets opportunity.
      </p>
      <p className="description">
        Artists can showcase their talent, apply for projects, and grow 
        their careers with global visibility. Recruiters gain access to a pool 
        of skilled professionals, making it easier to discover and hire the 
        right talent for their needs. With a user-friendly experience, we’re 
        here to simplify collaboration and foster meaningful connections in 
        the creative industry.
      </p>
    </div>

    {/* Right Side - Images */}
    <div className="about-images">
      <div className="main-image">
        <img src={about1} alt="CoreModeling Showcase" />

        {/* Left Overlay Image */}
        <div className="overlay-image overlay-left">
          <img src={about2} alt="Artist Portfolio" />
        </div>

        {/* Right Overlay Image */}
        <div className="overlay-image overlay-right">
          <img src={about3} alt="Recruiter Hiring" />
        </div>
      </div>
    </div>
  </div>
</section>


 <section className="steps-section">
      <h2 className="steps-heading">How Our Platform Works</h2>
  <p className="steps-subtext">
    Our platform is designed to bridge the gap between <strong>artists and recruiters</strong> in the creative industry. 
    Artists can build stunning profiles, upload photos, videos, and portfolios to highlight their talent. 
    At the same time, recruiters gain access to a wide pool of verified professionals, making it easy to 
    <strong> post projects, review applications, and hire the right talent</strong>. 
    From showcasing creativity to securing opportunities, CoreModeling streamlines every step of the journey.
  </p>
      <div className="steps-container">
        {/* Left side - Steps buttons */}
        <div className="steps-list">
          {stepsData.map((step, index) => (
            <button
              key={index}
              className={`step-btn ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Right side - Image + description */}
        <div className="steps-content">
          <img
            src={stepsData[activeIndex].img}
            alt={stepsData[activeIndex].title}
            className="step-image"
          />
          <p className="step-description">{stepsData[activeIndex].desc}</p>
        </div>
      </div>
    </section>


     {/* Browse by Category Section */}
<section className="categories-section">
  <h2 className="categories-heading">Browse by Category</h2>
  <p className="categories-subtext">
  Our platform empowers artists to showcase their talent by registering under 
  diverse categories such as <strong>models, actors, musicians, writers, filmmakers, 
  and many more</strong>. Each category is designed to highlight unique skill sets, 
  making it easier for recruiters to navigate through a structured pool of professionals. 
  With just a few clicks, recruiters can explore talent across industries, compare portfolios, 
  and connect with the right individuals — ensuring the perfect match for every creative requirement.
</p>

  <div className="categories-grid">
    {[
      { name: "Model", img: "/images/model.jpg" },
      { name: "Actor", img: "/images/actor.jpg" },
      { name: "Influencer", img: "/images/influencer.webp" },
      { name: "Writer", img: "/images/writer.jpg" },
      { name: "Stylist", img: "/images/stylist.avif" },
      { name: "Photographer", img: "/images/photographer.avif" },
      { name: "Advertising Professional", img: "/images/advertise.avif" },
      { name: "Singer", img: "/images/singer.jpg" },
      { name: "Musician", img: "/images/musician.jpg" },
      { name: "Dancer", img: "/images/dancer.cms" },
      { name: "Anchor", img: "/images/anchor.jpg" },
      { name: "Voice-over Artist", img: "/images/voiceover.jpg" },
      { name: "Filmmaker", img: "/images/filmmaker.jpg" },
      { name: "Standup Comedian", img: "/images/standup.avif" },
    ].map((cat, index) => (
      <div
        key={index}
        className="category-card"
        style={{ backgroundImage: `url(${cat.img})` }}
      >
        <div className="category-overlay">
          <h3>{cat.name}</h3>
        </div>
      </div>
    ))}
  </div>
</section>

  




    {/* ✅ Footer OUTSIDE slideshow */}
    <Footer />

    {/* Floating Login Modal */}
    {showLogin && (
      <div className="modal-overlay" onClick={() => setShowLogin(false)}>
        <div className="container" onClick={(e) => e.stopPropagation()}>
          <h2>Login - CoreModeling</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p
            onClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            Don’t have an account? Signup here
          </p>
        </div>
      </div>
    )}

    {/* Floating Signup Modal */}
    {showSignup && (
      <div className="modal-overlay" onClick={() => setShowSignup(false)}>
        <div className="container" onClick={(e) => e.stopPropagation()}>
          <Signup />
        </div>
      </div>
    )}
  </div>
);

};

export default Login;
