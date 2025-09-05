import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ArtistsPage.css";

const backendURL = "http://localhost:5000";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [selectedRole, setSelectedRole] = useState(""); // ✅ search filter state

  
  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Roles to search/filter
  const roles = [
    "model",
    "actor",
    "influencer",
    "writer",
    "stylist",
    "photographer",
    "advertising professional",
    "singer",
    "musician",
    "dancer",
    "anchor",
    "voice-over artist",
    "filmmaker",
    "standup-comedian",
  ];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch(`${backendURL}/api/artists`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const dateA = a.createdAt
              ? new Date(a.createdAt)
              : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
            const dateB = b.createdAt
              ? new Date(b.createdAt)
              : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
            return dateB - dateA;
          });
          setArtists(sorted);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    fetchArtists();
  }, []);

  // ✅ helper to get the first available media
  const getFirstMedia = (artist) => {
    if (artist.photos?.length > 0) {
      return { type: "image", src: artist.photos[0] };
    }
    if (artist.videos?.length > 0) {
      return { type: "video", src: artist.videos[0] };
    }
    return null;
  };

  // ✅ filter artists by selected role
  const filteredArtists = selectedRole
    ? artists.filter(
        (artist) =>
          (artist.identity || artist.role || "").toLowerCase() ===
          selectedRole.toLowerCase()
      )
    : artists;

  return (
    <>
      <Navbar />

      <div className="artists-page">
        <h1 className="page-title">Meet Our Artists</h1>

        {/* ✅ Search Filter */}
        <div className="search-filter">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Categories</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

    <div className="artists-grid">
  {filteredArtists.length > 0 ? (
    filteredArtists.map((artist) => {
      const firstMedia = getFirstMedia(artist);
      return (
        <div
          className="artist-card"
          key={artist._id}
          onClick={() => setSelectedArtist(artist)}
        >
          {firstMedia && firstMedia.type === "image" && (
            <img
              src={firstMedia.src}
              alt={artist.name}
              className="artist-photo"
            />
          )}
          {firstMedia && firstMedia.type === "video" && (
            <video className="artist-video" controls src={firstMedia.src} />
          )}
          <h2>{artist.name}</h2>
          <div className="artist-info">
            <p>
              <strong>Role:</strong> {artist.identity || artist.role}
            </p>

            {/* ✅ Protect recruiter-only fields */}
            <p>
              <strong>Email:</strong>{" "}
              {user?.premiumStatus === "granted" ? artist.email : "***"}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {user?.premiumStatus === "granted"
                ? artist.contact || "N/A"
                : "***"}
            </p>
            <p>
              <strong>Instagram:</strong>{" "}
              {user?.premiumStatus === "granted" && artist.instagram ? (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.instagram}
                </a>
              ) : (
                "***"
              )}
            </p>

            <p>
  <strong>Followers:</strong>{" "}
  {user?.premiumStatus === "granted"
    ? artist.instagramFollowers || "N/A"
    : "***"}
</p>

            <p>
              <strong>Gender:</strong> {artist.gender || "N/A"}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {artist.dob
                ? new Date(artist.dob).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>City:</strong> {artist.city || "N/A"}
            </p>
            <p>
              <strong>State:</strong> {artist.state || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {artist.country || "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {artist.language || "N/A"}
            </p>
            <p>{artist.description}</p>
          </div>
        </div>
      );
    })
  ) : (
    <p>No artists found.</p>
  )}
</div>

        {/* Modal + Preview stays same as your code */}
  {/* Modal */}
{selectedArtist && (
  <div className="artist-modal">
    <div className="artist-modal-content">
      <button
        className="close-btn"
        onClick={() => setSelectedArtist(null)}
      >
        ✖
      </button>

      <h2>Hello! This is {selectedArtist.name}.</h2>

      {/* ✅ Gallery */}
      <div className="artist-photos-gallery">
        {(user?.premiumStatus === "granted"
          ? [...(selectedArtist.photos || []), ...(selectedArtist.videos || [])] // show all
          : [...(selectedArtist.photos || []), ...(selectedArtist.videos || [])].slice(0, 1) // show only 1
        ).map((media, idx) =>
          media.includes("mp4") ? (
            <video
              key={idx}
              controls
              className="artist-gallery-photo"
              onClick={() =>
                setPreviewMedia({ type: "video", src: media })
              }
            >
              <source src={media} type="video/mp4" />
            </video>
          ) : (
            <img
              key={idx}
              src={media}
              alt={`${selectedArtist.name} ${idx}`}
              className="artist-gallery-photo"
              onClick={() =>
                setPreviewMedia({ type: "image", src: media })
              }
            />
          )
        )}

        {/* If not premium, show upgrade msg */}
        {user?.premiumStatus !== "granted" && (
          <p className="premium-msg">✨ Buy Premium to unlock full access ✨</p>
        )}
      </div>

      <div className="artist-info">
        <p>
          <strong>Role:</strong>{" "}
          {selectedArtist.identity || selectedArtist.role}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {user?.premiumStatus === "granted"
            ? selectedArtist.email
            : "***"}
        </p>
        <p>
          <strong>Contact:</strong>{" "}
          {user?.premiumStatus === "granted"
            ? selectedArtist.contact || "N/A"
            : "***"}
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          {user?.premiumStatus === "granted" && selectedArtist.instagram ? (
            <a
              href={selectedArtist.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedArtist.instagram}
            </a>
          ) : (
            "***"
          )}
        </p>


        <p>
  <strong>Followers:</strong>{" "}
  {user?.premiumStatus === "granted"
    ? selectedArtist.instagramFollowers || "N/A"
    : "***"}
</p>
        <p>
          <strong>Gender:</strong> {selectedArtist.gender || "N/A"}
        </p>
        <p>
          <strong>DOB:</strong>{" "}
          {selectedArtist.dob
            ? new Date(selectedArtist.dob).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>City:</strong> {selectedArtist.city || "N/A"}
        </p>
        <p>
          <strong>State:</strong> {selectedArtist.state || "N/A"}
        </p>
        <p>
          <strong>Country:</strong> {selectedArtist.country || "N/A"}
        </p>
        <p>
          <strong>Language:</strong> {selectedArtist.language || "N/A"}
        </p>
        <p>{selectedArtist.description}</p>
      </div>
    </div>
  </div>
)}

{/* ✅ Preview */}
{previewMedia && (
  <div className="media-preview" onClick={() => setPreviewMedia(null)}>
    {previewMedia.type === "image" ? (
      <img src={previewMedia.src} alt="Preview" className="preview-content" />
    ) : (
      <video
        src={previewMedia.src}
        controls
        autoPlay
        className="preview-content"
      />
    )}
  </div>
)}

      </div>

      <Footer />
    </>
  );
};

export default ArtistsPage;
