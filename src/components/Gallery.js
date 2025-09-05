import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Gallery.css";

const backendURL = "http://localhost:5000";

const Gallery = () => {
  const [gallery, setGallery] = useState({ photos: [], videos: [], name: "" });
  const [showUploadForm, setShowUploadForm] = useState({ type: "", visible: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");  

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          console.error("No logged-in user found");
          return;
        }

        const res = await axios.get(`${backendURL}/api/users/gallery`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setGallery(res.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const handleUploadClick = (type) => {
    setShowUploadForm({ type, visible: true });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file!");

    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", showUploadForm.type);

    try {
      const res = await axios.post(`${backendURL}/api/users/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setGallery(res.data);
      setShowUploadForm({ type: "", visible: false });
      setSelectedFile(null);

      setMessage(`${showUploadForm.type === "photo" ? "Image" : "Video"} uploaded successfully!`);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Upload failed. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCloseForm = () => {
    setShowUploadForm({ type: "", visible: false });
    setSelectedFile(null);
  };

  // ✅ Delete photo/video
  const handleDelete = async (url, type) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) return;

      // Optimistic UI update
      if (type === "photo") {
        setGallery((prev) => ({
          ...prev,
          photos: prev.photos.filter((p) => p !== url),
        }));
      } else {
        setGallery((prev) => ({
          ...prev,
          videos: prev.videos.filter((v) => v !== url),
        }));
      }

      // ✅ Backend call
      await axios.delete(`${backendURL}/api/users/delete`, {
        headers: { Authorization: `Bearer ${user.token}` },
        data: { url, type },
      });

      setMessage(`${type === "photo" ? "Image" : "Video"} deleted successfully!`);
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.error("Error deleting file:", error);
      setMessage("Delete failed. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Gallery-body">
      <div className="gallery-page">
        <h2>{gallery.name}'s Gallery</h2>

        {/* ✅ Show success/error message */}
        {message && <p className="message">{message}</p>}

        {/* Photos Section */}
        <div className="photos-section">
          <h3>Photos</h3>
          <button className="btn" onClick={() => handleUploadClick("photo")}>
            Upload Image
          </button>
          {gallery.photos.length > 0 ? (
            <div className="photos-grid">
              {gallery.photos.map((photo, i) => (
                <div key={i} className="photo-item">
                  <img src={photo} alt={`Photo ${i + 1}`} className="gallery-photo" />
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(photo, "photo")}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No photos uploaded yet.</p>
          )}
        </div>

        {/* Videos Section */}
        <div className="videos-section">
          <h3>Videos</h3>
          <button className="btn" onClick={() => handleUploadClick("video")}>
            Upload Video
          </button>
          {gallery.videos.length > 0 ? (
            <div className="videos-grid">
              {gallery.videos.map((video, i) => (
                <div key={i} className="video-item">
                  <video controls className="gallery-video">
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(video, "video")}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No videos uploaded yet.</p>
          )}
        </div>

        {/* Floating Upload Form */}
        {showUploadForm.visible && (
          <div className="upload-form-overlay">
            <form className="upload-form" onSubmit={handleUploadSubmit}>
              <h4>Upload {showUploadForm.type === "photo" ? "Image" : "Video"}</h4>
              <input
                type="file"
                accept={showUploadForm.type === "photo" ? "image/*" : "video/*"}
                onChange={handleFileChange}
              />
              <div className="form-buttons">
                <button type="submit">Upload</button>
                <button type="button" onClick={handleCloseForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Gallery;
