import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AdminBlogs.css";
import "../styles/responsive.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // ✅ NEW: Edit mode state
  const [editingBlogId, setEditingBlogId] = useState(null); // ✅ NEW: Track editing blog
  
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
    placeholder: "Write your blog content here...",
  });
  const [content, setContent] = useState("");

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        "https://cmi-backend-6xf1.onrender.com/api/blogs"
      );
      setBlogs(res.data);
      if (res.data.length > 0) setSelectedBlog(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update content when editor changes
  useEffect(() => {
    if (!quill) return;
    const handleChange = () => setContent(quill.root.innerHTML);
    quill.on("text-change", handleChange);
    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill]);

  // ✅ NEW: Pre-fill form when editing [web:21][web:25]
  useEffect(() => {
    if (quill && isEditMode && selectedBlog) {
      // Use dangerouslyPasteHTML to set initial content
      quill.clipboard.dangerouslyPasteHTML(selectedBlog.content);
      setContent(selectedBlog.content);
    }
  }, [quill, isEditMode, selectedBlog]);

  // ✅ NEW: Handle Edit Button Click
  const handleEditBlog = () => {
    if (!selectedBlog) return;
    
    setIsEditMode(true);
    setEditingBlogId(selectedBlog._id);
    setTitle(selectedBlog.title);
    setContent(selectedBlog.content);
    setMedia(null); // Reset media (user can upload new one)
    setShowForm(true);
    
    // Wait for quill to be ready, then set content
    setTimeout(() => {
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(selectedBlog.content);
      }
    }, 100);
  };

  // ✅ UPDATED: Handle form submission (Create or Update)
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (media) formData.append("media", media);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (!token) return alert("You must be logged in as admin");

    try {
      let res;
      
      if (isEditMode) {
        // ✅ UPDATE existing blog
        res = await axios.put(
          `https://cmi-backend-6xf1.onrender.com/api/blogs/${editingBlogId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Update blogs list
        const updatedBlogs = blogs.map((blog) =>
          blog._id === editingBlogId ? res.data : blog
        );
        setBlogs(updatedBlogs);
        setSelectedBlog(res.data);
        alert("Blog updated successfully!");
      } else {
        // ✅ CREATE new blog
        res = await axios.post(
          "https://cmi-backend-6xf1.onrender.com/api/blogs",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setBlogs([res.data, ...blogs]);
        setSelectedBlog(res.data);
        alert("Blog created successfully!");
      }

      // Reset form
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving blog");
    }
  };

  // ✅ NEW: Reset form function
  const resetForm = () => {
    setTitle("");
    setContent("");
    setMedia(null);
    setShowForm(false);
    setIsEditMode(false);
    setEditingBlogId(null);
    
    // Clear editor content
    if (quill) quill.setContents([]);
  };

  // ✅ NEW: Handle Cancel
  const handleCancel = () => {
    resetForm();
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (!token) return alert("You must be logged in as admin");

    try {
      await axios.delete(
        `https://cmi-backend-6xf1.onrender.com/api/blogs/${blogId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedBlogs = blogs.filter((b) => b._id !== blogId);
      setBlogs(updatedBlogs);
      setSelectedBlog(updatedBlogs[0] || null);
      alert("Blog deleted successfully!");
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
              onClick={() => {
                setIsEditMode(false);
                setShowForm(!showForm);
              }}
            >
              {showForm ? "✕ Cancel" : "+ Create New Blog"}
            </button>
          </div>

          {/* Blog Form Modal */}
          {showForm && (
            <div className="modal-overlay" onClick={handleCancel}>
              <form
                onSubmit={handleSubmitBlog}
                className="blog-form"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Form Header */}
                <div className="blog-form-header">
                  <h2 className="blog-form-title">
                    {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
                  </h2>
                  <button
                    type="button"
                    className="close-form-btn"
                    onClick={handleCancel}
                    aria-label="Close form"
                  >
                    ×
                  </button>
                </div>

                {/* Title Input */}
                <div className="form-group">
                  <label className="form-label">Blog Title</label>
                  <input
                    type="text"
                    placeholder="Enter an engaging title for your blog"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="blog-input"
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="form-group">
                  <label className="form-label">Blog Content</label>
                  <div ref={quillRef} className="blog-editor" />
                </div>

                {/* Media Upload */}
                <div className="form-group">
                  <label className="form-label">
                    Featured Image/Video {isEditMode && "(Upload new to replace)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files[0])}
                    className="blog-file"
                  />
                  {isEditMode && selectedBlog?.media && (
                    <p style={{ color: "#999", fontSize: "12px", marginTop: "5px" }}>
                      Current: {selectedBlog.media.split("/").pop()}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="blog-submit-btn">
                  {isEditMode ? "Update Blog Post" : "Publish Blog Post"}
                </button>
              </form>
            </div>
          )}

          {/* Sidebar + Content */}
          <div className="blogs-sidebar-container">
            <aside className="blogs-sidebar">
              <h3 className="sidebar-heading">All Blogs</h3>
              {blogs.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                  No blogs yet. Create your first blog!
                </p>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className={`blog-title-item ${
                      selectedBlog?._id === blog._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedBlog(blog)}
                  >
                    {blog.title}
                  </div>
                ))
              )}
            </aside>

            {/* Selected Blog */}
            <div className="blogs-content">
              {selectedBlog ? (
                <article className="selected-blog">
                  <h1 className="blog-title">{selectedBlog.title}</h1>

                  {selectedBlog.media &&
                    (selectedBlog.media.includes("video") ? (
                      <video controls className="blog-video">
                        <source src={selectedBlog.media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={selectedBlog.media}
                        alt={selectedBlog.title}
                        className="blog-image"
                      />
                    ))}

                  {/* Render HTML content */}
                  <section
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />

                  {/* ✅ Action Buttons Container */}
                  <div className="blog-actions">
                    <button
                      className="edit-blog-btn"
                      onClick={handleEditBlog}
                    >
                      ✏️ Edit Blog
                    </button>
                    <button
                      className="delete-blog-btn"
                      onClick={() => handleDeleteBlog(selectedBlog._id)}
                    >
                      🗑 Delete Blog
                    </button>
                  </div>
                </article>
              ) : (
                <div style={{ textAlign: "center", padding: "100px 20px", color: "#fff" }}>
                  <h2>No Blog Selected</h2>
                  <p>Select a blog from the sidebar or create a new one</p>
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