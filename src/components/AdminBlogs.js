import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuill } from "react-quilljs"; // Updated for React 19 compatibility
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
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
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

  // Post a new blog
  const handlePostBlog = async (e) => {
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
      const res = await axios.post(
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
      setTitle("");
      setContent("");
      setMedia(null);
      setShowForm(false);

      // Clear editor content
      if (quill) quill.setContents([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error posting blog");
    }
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

              {/* Rich Text Editor */}
              <div ref={quillRef} className="blog-editor" />

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMedia(e.target.files[0])}
                className="blog-file"
              />

              <button
                type="submit"
                className="blog-submit-btn"
                onClick={(e) => handlePostBlog(e)} // ensure onClick works
              >
                Post Blog
              </button>
            </form>
          )}

          {/* Sidebar + Content */}
          <div className="blogs-sidebar-container">
            <aside className="blogs-sidebar">
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
            </aside>

            {/* Selected Blog */}
            <div className="blogs-content">
              {selectedBlog && (
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

                  <button
                    className="delete-blog-btn"
                    onClick={() => handleDeleteBlog(selectedBlog._id)}
                  >
                    Delete Blog
                  </button>
                </article>
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
