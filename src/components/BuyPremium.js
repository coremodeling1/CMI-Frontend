import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/BuyPremium.css";

const BuyPremium = () => {
  return (
    <div className="buy-premium-page">
      <Navbar />

      <main className="buy-premium-content">
        {/* About Core Modeling */}
    <section className="about-section">
  <h1>About Core Modeling</h1>
  <p>
    Core Modeling is a platform designed to bridge the gap between 
    talented artists and recruiters across the industry. We help recruiters 
    connect with verified artists by offering secure, streamlined, and 
    professional access to their portfolios.
  </p>
</section>

{/* Premium Information */}
<section className="premium-section">
  <h2>Premium Benefits for Recruiters</h2>
  <ul>
    <li>🔹 Unlock full access to the complete image & video galleries of artists (not just 4 previews).</li>
    <li>🔹 View verified contact details of artists (phone number & email).</li>
    <li>🔹 Access artists’ social media links including Instagram to connect directly.</li>
  </ul>

  <p className="convince-text">
    With Premium, you get unrestricted access to artist information and 
    portfolios, making your recruitment process faster, more transparent, 
    and more effective. Take the next step in discovering top talent.
  </p>

  <div className="contact-box">
    <p>
       To upgrade to Premium, kindly send us an email at: <br />
      <a href="mailto:coremodeling.premium@gmail.com">
        coremodeling1@gmail.com
      </a>
    </p>
  </div>
</section>

      </main>

      <Footer />
    </div>
  );
};

export default BuyPremium;
