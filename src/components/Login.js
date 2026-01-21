import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/style.css";
import slide1 from "../images/slide1.jpg";
import step1 from "../images/step1.png";
import about1 from "../images/about1.jpg";
import about2 from "../images/about2.jpg";
import about3 from "../images/about3.jpg";
import Signup from "./Signup";
import logo from "../images/logo.png";
import "../styles/responsive.css";
import Footer from "./Footer";
import applyProject from "../images/apply-project.jpeg";
import artist from "../images/artist.jpeg";
import gallery from "../images/gallery.jpeg";
import postProject from "../images/post-project.jpeg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupRole, setSignupRole] = useState("artist");
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ NEW STATE
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState([]);
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
      desc: "Both Recruiters and Artists can create an account and log in to start using CoreModelling.",
    },
    {
      img: artist,
      title: "Explore Artists",
      desc: "Recruiters can browse artist profiles, view their portfolios, photos, and videos.",
    },
    {
      img: postProject,
      title: "Upload Projects",
      desc: "Recruiters can upload exciting modeling projects for artists to discover and apply to.",
    },
    {
      img: applyProject,
      title: "Apply to Projects",
      desc: "Artists can explore available projects and send their applications directly through the platform.",
    },
    {
      img: gallery,
      title: "Build Your Gallery",
      desc: "Artists can upload photos and videos to their personal gallery to showcase their talent.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ NEW FUNCTION: Handle category click
  const handleCategoryClick = (categoryName) => {
    setSignupRole("artist");
    setSelectedCategory(categoryName.toLowerCase());
    setShowSignup(true);
  };

  // Input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://cmi-backend-6xf1.onrender.com/api/auth/login",
        formData
      );

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

  useEffect(() => {
    const accessToken = process.env.REACT_APP_IG_ACCESS_TOKEN;

    async function fetchInstagramFeed() {
      try {
        const res = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`
        );

        const data = await res.json();
        if (data.error) {
          console.error("Instagram API error:", data.error);
        } else if (data.data) {
          setInstagramPosts(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching Instagram feed:", error);
      }
    }

    fetchInstagramFeed();
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="auth-navbar">
        <div className="auth-logo">
          <div className="logo">
            <img src={logo} alt="CoreModelling Logo" className="navbar-logo" />
          </div>
        </div>
        <ul className="auth-nav-links center-nav">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <span onClick={() => setShowLogin(true)}>Login</span>
          </li>
          <li>
            <span onClick={() => setShowSignup(true)}>Signup</span>
          </li>
        </ul>
      </nav>

      {/* Hero Section + Slideshow */}
      <div className="hero-wrapper">
        <div
          className="slideshow"
          style={{ backgroundImage: `url(${slides[currentSlide]})` }}
        ></div>

        <header className="hero-section">
          <h1>Welcome to CoreModelling</h1>
          <p className="tagline">Where Talent Meets Spotlight</p>
          <p>
            Connecting <strong>Artists</strong>, <strong>Recruiters</strong>,
            and <strong>Creators</strong> in one powerful platform.
          </p>
          <button
            onClick={() => {
              setSignupRole("artist");
              setSelectedCategory(""); // Reset category
              setShowSignup(true);
            }}
            className="explore-btn"
          >
            Get Started
          </button>
        </header>

        {/* Features Section */}
        <section className="features">
          <div
            className="feature-card"
            onClick={() => {
              setSignupRole("artist");
              setSelectedCategory(""); // Reset category
              setShowSignup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <h2>For Artists</h2>
            <p>
              Showcase your talent and connect with top recruiters worldwide.
            </p>
          </div>

          <div
            className="feature-card"
            onClick={() => {
              setSignupRole("recruiter");
              setSelectedCategory(""); // Reset category
              setShowSignup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <h2>For Recruiters</h2>
            <p>Discover passionate artists and build your dream team easily.</p>
          </div>

          <div className="feature-card">
            <h2>Blogs & Updates</h2>
            <p>Stay inspired with the latest trends and success stories.</p>
          </div>
        </section>
      </div>

      <section className="about-section">
        <div className="about-container">
          {/* Left Side - Text */}
          <div className="about-text">
            <p className="intro">Welcome to CoreModelling</p>
            <h2 className="title">Connecting Artists & Recruiters</h2>
            <p className="description">
              CoreModelling connects talented artists with recruiters in one creative hub. Artists showcase their work, apply for projects, and gain global exposure, while recruiters easily discover and hire the right talent. A user-friendly platform built to simplify collaboration and create meaningful industry connections.
            </p>
          </div>

          {/* Right Side - Images */}
          <div className="about-images">
            <div className="main-image">
              <img src={about3} alt="CoreModelling Showcase" />

              {/* Left Overlay Image */}
              <div className="overlay-image overlay-left">
                <img src={about1} alt="Artist Portfolio" />
              </div>

              {/* Right Overlay Image */}
              <div className="overlay-image overlay-right">
                <img src={about2} alt="Recruiter Hiring" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <h2 className="steps-heading">How Our Platform Works</h2>
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
          Our platform lets artists register across diverse creative categories, making their talents easy to discover. Recruiters can quickly browse, compare portfolios, and connect with the right professionals for any creative need.
        </p>

        <div className="categories-grid">
          {[
            { name: "Model", img: "/images/model.jpg" },
            { name: "Actor", img: "/images/actor.jpg" },
            { name: "Influencer", img: "/images/influencer.JPG" },
            { name: "Writer", img: "/images/writer.jpg" },
            { name: "Stylist", img: "/images/stylist.JPG" },
            { name: "Photographer", img: "/images/photographer.JPG" },
            { name: "Advertising Professional", img: "/images/advertise.avif" },
            { name: "Singer", img: "/images/singer.jpg" },
            { name: "Musician", img: "/images/musician.jpg" },
            { name: "Dancer", img: "/images/dancer.cms" },
            { name: "Anchor", img: "/images/anchor.jpg" },
            { name: "Voice-over Artist", img: "/images/voiceover.jpg" },
            { name: "Filmmaker", img: "/images/filmmaker.jpg" },
            { name: "Standup Comedian", img: "/images/standup.JPG" },
          ].map((cat, index) => (
            <div
              key={index}
              className="category-card"
              style={{ backgroundImage: `url(${cat.img})`, cursor: "pointer" }}
              onClick={() => handleCategoryClick(cat.name)} // ✅ ADDED CLICK HANDLER
            >
              <div className="category-overlay">
                <h3>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-wrapper">
          <h2 className="faq-heading">Frequently Asked Questions</h2>
          <p className="faq-subtext">
            Everything you need to know about using CoreModelling as an Artist or
            Recruiter
          </p>

          <div className="faq-container">
            {/* ARTIST FAQ */}
            <div className="faq-column">
              <h3 className="faq-title">For Artists</h3>

              <details>
                <summary>I'm a fresher, how can I start?</summary>
                <p>
                  Freshers can start by creating a complete profile, selecting
                  the right category, and uploading photos, videos, or
                  portfolios. Even without experience, showcasing your talent
                  helps attract recruiters.
                </p>
              </details>

              <details>
                <summary>
                  When will my profile be visible to recruiters?
                </summary>
                <p>
                  Your profile will be visible only after it is reviewed and
                  approved by the CoreModelling team. Pending or rejected
                  profiles are not shown to recruiters.
                </p>
              </details>

              <details>
                <summary>
                  Can I apply for projects if my profile is pending or rejected?
                </summary>
                <p>
                  No. Artists can apply for projects only after their profile is
                  approved. Pending or rejected profiles cannot apply to any
                  projects.
                </p>
              </details>

              <details>
                <summary>How will I get work?</summary>
                <p>
                  Recruiters post projects regularly. Approved artists can
                  browse projects and apply directly. A strong profile improves
                  your chances of selection.
                </p>
              </details>

              <details>
                <summary>
                  Do you charge any registration or onboarding fees?
                </summary>
                <p>
                  No. Artist registration and onboarding on CoreModelling are
                  completely free.
                </p>
              </details>

              <details>
                <summary>Do you guarantee work or roles?</summary>
                <p>
                  CoreModelling provides opportunities and visibility, but final
                  selection depends entirely on recruiters and project
                  requirements.
                </p>
              </details>
            </div>

            {/* RECRUITER FAQ */}
            <div className="faq-column">
              <h3 className="faq-title">For Recruiters</h3>

              <details>
                <summary>Is posting a project free?</summary>
                <p>
                  No. Recruiters must have a Premium membership to post projects
                  on CoreModelling.
                </p>
              </details>

              <details>
                <summary>Can I view artist profiles for free?</summary>
                <p>
                  You can browse categories and basic listings for free. Viewing
                  full artist profiles, portfolios, photos, and videos requires
                  a Premium plan.
                </p>
              </details>

              <details>
                <summary>What do I get with the Premium plan?</summary>
                <p>
                  Premium access allows you to post projects, view complete
                  artist profiles, portfolios, media galleries, and contact
                  artists directly.
                </p>
              </details>

              <details>
                <summary>Is Premium required to hire artists?</summary>
                <p>
                  Yes. Premium is required to view detailed profiles and
                  communicate directly with artists.
                </p>
              </details>

              <details>
                <summary>How can I get the Premium membership?</summary>
                <p>
                  To become a Premium member, please contact us directly using
                  the details below.
                </p>
              </details>

              <details>
                <summary>How can I contact CoreModelling?</summary>
                <p>
                  Email: [coremodeling1@gmail.com](mailto:coremodeling1@gmail.com) <br />
                  Phone: +91 090045 00657 <br />
                  Address: 1st Floor Office No-02 Seasons Harmony Nr Ayush Nx,
                  Kalyan West, Maharashtra 421301
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="instagram-section">
        <h2 className="insta-h2">Connect With Us On Instagram</h2>
        <div className="feed">
          {instagramPosts.length > 0 ? (
            instagramPosts.map((item) => (
              <div
                key={item.id}
                className="feed-item"
                onClick={() => window.open(item.permalink, "_blank")}
              >
                {item.media_type === "IMAGE" ||
                item.media_type === "CAROUSEL_ALBUM" ? (
                  <img src={item.media_url} alt="Instagram Post" />
                ) : item.media_type === "VIDEO" ? (
                  <video autoPlay muted loop controls>
                    <source src={item.media_url} type="video/mp4" />
                  </video>
                ) : null}
              </div>
            ))
          ) : (
            <p>Loading Instagram feed...</p>
          )}
        </div>
      </section>

      <Footer />

      {/* Floating Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <h2>Login - CoreModelling</h2>
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
              Don't have an account? Signup here
            </p>
          </div>
        </div>
      )}

      {/* Floating Signup Modal */}
      {showSignup && (
        <div className="modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <Signup role={signupRole} preSelectedCategory={selectedCategory} /> {/* ✅ PASS CATEGORY */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;