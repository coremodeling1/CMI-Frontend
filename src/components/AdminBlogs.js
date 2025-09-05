import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AdminBlogs.css";
import "../styles/responsive.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
      if (res.data.length > 0) setSelectedBlog(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePostBlog = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (media) formData.append("media", media);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (!token) return alert("You must be logged in as admin to post a blog");

    try {
      const res = await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const newBlogs = [res.data, ...blogs];
      setBlogs(newBlogs);
      setSelectedBlog(res.data);
      setTitle("");
      setContent("");
      setMedia(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error posting blog");
    }
  };

  // ✅ Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (!token) return alert("You must be logged in as admin to delete a blog");

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update frontend state
      const updatedBlogs = blogs.filter((b) => b._id !== blogId);
      setBlogs(updatedBlogs);
      setSelectedBlog(updatedBlogs.length > 0 ? updatedBlogs[0] : null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting blog");
    }
  };

  return (
    <>
      <Navbar />
    <div className="blogs-body">
      <div className="admin-blogs-container sidebar-layout">
        {/* Post Blog Button */}
        <div className="post-blog-btn-container">
          <button
            className="post-blog-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Post a Blog"}
          </button>
        </div>

        {/* Blog Form */}
        {showForm && (
          <form onSubmit={handlePostBlog} className="blog-form">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="blog-input"
            />
            <textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="blog-textarea"
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files[0])}
              className="blog-file"
            />
            <button type="submit" className="blog-submit-btn">
              Post Blog
            </button>
          </form>
        )}

        {/* Sidebar + Content */}
        <div className="blogs-sidebar-container">
          {/* Sidebar */}
          <div className="blogs-sidebar">
            <h3 className="sidebar-heading">Blogs</h3>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className={`blog-title-item ${
                  selectedBlog?._id === blog._id ? "active" : ""
                }`}
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.title}
              </div>
            ))}
          </div>

          {/* Selected Blog */}
          <div className="blogs-content">
            {selectedBlog && (
              <div className="selected-blog">
                <h2 className="blog-title">{selectedBlog.title}</h2>
                {selectedBlog.media &&
                  (selectedBlog.media.includes("video") ? (
                    <video controls className="blog-video">
                      <source src={selectedBlog.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedBlog.media}
                      alt={selectedBlog.title}
                      className="blog-image"
                    />
                  ))}
                <div className="blog-content">
                  <p>{selectedBlog.content}</p>
                </div>

                {/* ✅ Delete Button */}
                <button
                  className="delete-blog-btn"
                  onClick={() => handleDeleteBlog(selectedBlog._id)}
                >
                  Delete Blog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
      <Footer />
    </>
  );
};

export default AdminBlogs;
