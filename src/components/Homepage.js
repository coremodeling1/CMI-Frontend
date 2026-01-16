import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/style.css";
import "../styles/homepage.css"

import about1 from "../images/about1. jpg"
import about2 from "../images/about2.jpg"
import about3 from "../images/about3.jpg"
import step1 from "../images/step1.png"
import applyProject from "../images/apply-project.jpeg"
import artist from "../images/artist.jpeg"
import gallery from "../images/gallery.jpeg"
import postProject from "../images/post-project.jpeg"




const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [instagramPosts, setInstagramPosts] = useState([]);



  
  const stepsData = [
    {
      img: step1,
      title: "Sign Up & Login",
      desc: "Both Recruiters and Artists can create an account and log in to start using CoreModeling.",
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
   
  
  
    useEffect(() => {
      const accessToken = process.env.REACT_APP_IG_ACCESS_TOKEN;  
      // const userId = process.env.REACT_APP_IG_USER_ID;
    
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
    <div className="homepage-wrapper">
      <Navbar />

      <div className="homepage-hero-section">
        <header className="homepage-hero">
          <h1>
            Welcome to <span>CoreModeling</span>
          </h1>
          <p className="homepage-subtext">Where Talent Meets Spotlight</p>
          <p>
            Connecting <strong>Artists</strong>, <strong>Recruiters</strong>, and{" "}
            <strong>Creators</strong> in one powerful platform.
          </p>
          <p className="homepage-user-greet">Hello, {user?.name}</p>
       
        </header>

        <section className="homepage-features">
          <div className="homepage-feature-card">
            <h2>For Artists</h2>
            <p>Showcase your talent and connect with top recruiters worldwide.</p>
          </div>
          <div className="homepage-feature-card">
            <h2>For Recruiters</h2>
            <p>Discover passionate artists and build your dream team easily.</p>
          </div>
          <div className="homepage-feature-card">
            <h2>Blogs & Updates</h2>
            <p>Stay inspired with the latest trends and success stories.</p>
          </div>
        </section>
      </div>
  
  
        <section className="about-section">
        <div className="about-container">
          {/* Left Side - Text */}
          <div className="about-text fade-in-up delay-1">
            <p className="intro">Welcome to CoreModeling</p>
            <h2 className="title">Connecting Artists & Recruiters</h2>
            <p className="description">
              CoreModeling is a dedicated platform that connects talented artists with recruiters, creating a space where creativity meets opportunity. Artists can showcase their work, apply for projects, and grow their careers with global visibility.
            </p>
            <p className="description">
              Recruiters gain access to a diverse pool of skilled professionals, making it easier to discover and hire the right talent. With a user friendly experience, CoreModeling simplifies collaboration and builds meaningful connections in the creative industry.
            </p>
          
          </div>
      
          {/* Right Side - Images */}
          <div className="about-images slide-in-left delay-2">
            <div className="main-image">
              <img src={about3} alt="CoreModeling Showcase" />
      
              {/* Left Overlay Image */}
              <div className="overlay-image overlay-left slide-in-left delay-3">
                <img src={about1} alt="Artist Portfolio" />
              </div>
      
              {/* Right Overlay Image */}
              <div className="overlay-image overlay-right slide-in-left delay-4">
                <img src={about2} alt="Recruiter Hiring" />
              </div>
            </div>
          </div>
        </div>
      </section>


 <section className="steps-section">
      <h2 className="steps-heading">How Our Platform Works</h2>
  <p className="steps-subtext">
    CoreModeling connects artists and recruiters in the creative industry by allowing artists to showcase their talent through profiles, photos, videos, and portfolios, while recruiters access verified professionals to post projects, review applications, and hire the right talent with ease.
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


<section className="faq-section">
  <div className="faq-wrapper">
    <h2 className="faq-heading">Frequently Asked Questions</h2>
    <p className="faq-subtext">
      Everything you need to know about using CoreModeling as an Artist or Recruiter
    </p>

    <div className="faq-container">

      {/* ARTIST FAQ */}
      <div className="faq-column">
        <h3 className="faq-title">For Artists</h3>

        <details>
          <summary>I’m a fresher, how can I start?</summary>
          <p>
            Freshers can start by creating a complete profile, selecting the right category,
            and uploading photos, videos, or portfolios. Even without experience, showcasing
            your talent helps attract recruiters.
          </p>
        </details>

        <details>
          <summary>When will my profile be visible to recruiters?</summary>
          <p>
            Your profile will be visible only after it is reviewed and approved by the
            CoreModeling team. Pending or rejected profiles are not shown to recruiters.
          </p>
        </details>

        <details>
          <summary>Can I apply for projects if my profile is pending or rejected?</summary>
          <p>
            No. Artists can apply for projects only after their profile is approved.
            Pending or rejected profiles cannot apply to any projects.
          </p>
        </details>

        <details>
          <summary>How will I get work?</summary>
          <p>
            Recruiters post projects regularly. Approved artists can browse projects
            and apply directly. A strong profile improves your chances of selection.
          </p>
        </details>

        <details>
          <summary>What kind of projects are available?</summary>
          <p>
            Projects include modeling shoots, ad campaigns, fashion shows, short films,
            music videos, brand promotions, and social media collaborations.
          </p>
        </details>

        <details>
          <summary>Do you charge any registration or onboarding fees?</summary>
          <p>
            No. Artist registration and onboarding on CoreModeling are completely free.
          </p>
        </details>

        <details>
          <summary>Do you guarantee work or roles?</summary>
          <p>
            CoreModeling provides opportunities and visibility, but final selection
            depends entirely on recruiters and project requirements.
          </p>
        </details>
      </div>

      {/* RECRUITER FAQ */}
      <div className="faq-column">
        <h3 className="faq-title">For Recruiters</h3>

        <details>
          <summary>Is posting a project free?</summary>
          <p>
            No. Recruiters must have a Premium membership to post projects on CoreModeling.
          </p>
        </details>

        <details>
          <summary>Can I view artist profiles for free?</summary>
          <p>
            You can browse categories and basic listings for free. Viewing full artist
            profiles, portfolios, photos, and videos requires a Premium plan.
          </p>
        </details>

        <details>
          <summary>What do I get with the Premium plan?</summary>
          <p>
            Premium access allows you to post projects, view complete artist profiles,
            portfolios, media galleries, and contact artists directly.
          </p>
        </details>

        <details>
          <summary>What kind of artists are available?</summary>
          <p>
            Models, actors, influencers, musicians, photographers, dancers,
            writers, filmmakers, and other creative professionals.
          </p>
        </details>

        <details>
          <summary>Is Premium required to hire artists?</summary>
          <p>
            Yes. Premium is required to view detailed profiles and communicate
            directly with artists.
          </p>
        </details>

        <details>
          <summary>How can I get the Premium membership?</summary>
          <p>
            To become a Premium member, please contact us directly using the details below.
          </p>
        </details>

        <details>
          <summary>How can I contact CoreModeling?</summary>
          <p>
            Email: coremodeling1@gmail.com <br />
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
          {item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM" ? (
            <img src={item.media_url} alt="Instagram Post" />
          ) : item.media_type === "VIDEO" ? (
            <video autoPlay muted loop controls>
              <source src={item.media_url} type="video/mp4" />
            </video>
          ) : null}
        </div>
      ))
    ) : (
      <p>Loading Instagram feed....</p>
    )}
  </div>
</section>




      <Footer />
    </div>
  );
};

export default HomePage;
