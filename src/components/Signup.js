import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

const Signup = () => {
  const [role, setRole] = useState("artist");
  const [identity, setIdentity] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    contact: "",
    gender: "",
    dob: "",
    city: "",
    state: "",
    country: "",
    language: "",
    instagram: "",   // ✅ added here
    instagramFollowers: "",  // ✅ new field
  });
  const [profilePic, setProfilePic] = useState(null);
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = new FormData();

      // append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      data.append("role", role);
      data.append("identity", role === "artist" ? identity : "");

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      files.forEach((file) => {
        data.append("files", file);
      });

      await axios.post("http://localhost:5000/api/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Successfully registered!");
      setFormData({
        name: "",
        email: "",
        password: "",
        description: "",
        contact: "",
        gender: "",
        dob: "",
        city: "",
        state: "",
        country: "",
        language: "",
        instagram: "",   // ✅ reset instagram
         instagramFollowers: "",  // ✅ reset followers count
      });
      setFiles([]);
      setProfilePic(null);
      setIdentity("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const photoIdentities = [
    "model","actor","influencer","writer","stylist",
    "photographer","advertising professional",
  ];
  const videoIdentities = [
    "singer","musician","dancer","anchor",
    "voice-over artist","filmmaker","standup-comedian",
  ];

  const showPhotoFields = photoIdentities.includes(identity);
  const showVideoFields = videoIdentities.includes(identity);

  return (
    <>
      {successMessage ? (
        <div className="success-container">
          <p className="success-message">{successMessage}</p>
        </div>
      ) : (
        <div className="signup-container">
          <h2>Signup - CoreModeling</h2>
          <div className="form-scroll">
            <form onSubmit={handleSubmit}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="artist">Artist</option>
                <option value="recruiter">Recruiter</option>
              </select>

              {role === "artist" && (
                <select
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                >
                  <option value="">Select Identity</option>
                  <option value="model">Model</option>
                  <option value="actor">Actor</option>
                  <option value="influencer">Influencer</option>
                  <option value="singer">Singer</option>
                  <option value="musician">Musician</option>
                  <option value="dancer">Dancer</option>
                  <option value="writer">Writer</option>
                  <option value="anchor">Anchor</option>
                  <option value="stylist">Stylist</option>
                  <option value="advertising professional">Advertising Professional</option>
                  <option value="voice-over artist">Voice-over Artist</option>
                  <option value="photographer">Photographer</option>
                  <option value="filmmaker">Filmmaker</option>
                  <option value="standup-comedian">Standup Comedian</option>
                </select>
              )}

              <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

              {role === "artist" && (
                <>
                  <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input type="date" name="dob" onChange={handleChange} required />
                  <input type="text" name="city" placeholder="City" onChange={handleChange} required />
                  <input type="text" name="state" placeholder="State" onChange={handleChange} required />
                  <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
                  <input type="text" name="language" placeholder="Language" onChange={handleChange} required />

                  {/* ✅ Instagram field */}
                  <input
                    type="url"
                    name="instagram"
                    placeholder="Paste your Instagram Profile Link"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                  {/* ✅ Instagram Followers Count field */}
<input
  type="text"
  name="instagramFollowers"
  placeholder="Enter your Instagram Followers Count"
  value={formData.instagramFollowers}
  onChange={handleChange}
/>
                </>
              )}

              <label>Upload Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePicChange} />

              {showPhotoFields && (
                <>
                  <label>Upload photo</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                  <textarea name="description" placeholder="Add a short description" onChange={handleChange} />
                </>
              )}

              {showVideoFields && (
                <>
                  <label>Upload video</label>
                  <input type="file" multiple accept="video/*" onChange={handleFileChange} />
                  <textarea name="description" placeholder="Add a short description" onChange={handleChange} />
                </>
              )}

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit">Signup</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
